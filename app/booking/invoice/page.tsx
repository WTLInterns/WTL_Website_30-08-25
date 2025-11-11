"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

// Define interfaces for TypeScript type safety
const driverrate=300;
interface CarData {
  cabId: string;
  name: string;
  image: string;
  price: number;
  features: string[];
  category: string;
  pickupLocation: string;
  dropLocation: string;
  date: string;
  returnDate: string;
  time: string;
  tripType: string;
  distance: string;
  days: number;
  packageName: string;
  estimatedTravelTime: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  remarks: string;
  hasGST: boolean;
  agreeToTerms: boolean;
}

interface FormErrors {
  phone: string;
}

interface PricingData {
  driverrate: number;
  gst: number;
  service: number;
  total: number;
  isCalculated: boolean;
}

interface DiscountDTO {
  id: number;
  couponCode: string;
  priceDiscount: number;
  isEnabled: string;
  expiryDate: string; // yyyy-MM-dd
}

// Ensure the Razorpay script is loaded in your root layout or document file.
declare global {
  interface Window {
    Razorpay: any;
  }
}

function InvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 59, seconds: 59 });

  // Car data loaded via URL parameters
  const [carData, setCarData] = useState<CarData>({
    cabId: searchParams.get("cabId") || "",
    name: searchParams.get("modelName") || searchParams.get("name") || "",
    image: searchParams.get("image") || "/images/sedan-premium.jpg",
    price: Number(searchParams.get("price")) || 0,
    features: searchParams.get("features")?.split(",") || [],
    category: searchParams.get("category") || "",
    pickupLocation: searchParams.get("pickupLocation") || "",
    dropLocation: searchParams.get("dropLocation") || "",
    date: searchParams.get("date") || "",
    returnDate: searchParams.get("Returndate") || "",
    time: searchParams.get("time") || "",
    tripType: searchParams.get("tripType") || "oneWay",
    distance: searchParams.get("distance") || "0",
    days: Number(searchParams.get("days")) || 0,
    packageName: searchParams.get("packageName") || "",
    estimatedTravelTime: searchParams.get("estimatedTravelTime") || "",
  });

  // Booking form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    remarks: "",
    hasGST: false,
    agreeToTerms: false,
  });

  // Field error state for form validations (phone field)
  const [formErrors, setFormErrors] = useState<FormErrors>({ phone: "" });

  // Pricing state coming from the pricing API (invoice1 endpoint)
  const [pricing, setPricing] = useState<PricingData>({
    driverrate: 0,
    gst: 0,
    service: 0,
    total: 0,
    isCalculated: false,
  });

  // State for payment selection
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState(""); // 'full' or 'partial'
  const [partialAmount, setPartialAmount] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Payment error state management
  const [paymentError, setPaymentError] = useState("");
  const [showPaymentError, setShowPaymentError] = useState(false);

  // Audio ref for success sound
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  // Razorpay public key from environment variables
  const razorpayKeyId = "rzp_test_ZzKJz2egIV36gC";

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState<number>(Number.POSITIVE_INFINITY);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(0);
  const [availableCoupons, setAvailableCoupons] = useState<DiscountDTO[]>([]);

  // Extra options state
  const [extras, setExtras] = useState({
    pet: false,
    carrier: false,
  });

  // Fetch available coupons from backend
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.worldtriplink.com";
        const res = await axios.get(`${base}/discount/getAll`);
        const items: DiscountDTO[] = res.data || [];
        const today = new Date();
        const enabled = items
          .filter((c) => String(c.isEnabled).toLowerCase() === "true")
          .filter((c) => {
            if (!c.expiryDate) return true; // treat null/empty as no expiry
            const d = new Date(c.expiryDate);
            if (isNaN(d.getTime())) return true; // malformed date -> allow
            d.setHours(23, 59, 59, 999); // inclusive expiry
            return d >= today;
          });
        setAvailableCoupons(enabled);
      } catch (e) {
        // ignore silently; UI will allow manual code entry
      }
    };
    fetchCoupons();
  }, []);

  // Apply a coupon: set discount and recompute pricing totals for display cards
  const applyCoupon = (coupon: DiscountDTO) => {
    const discountValue = Math.max(0, Number(coupon.priceDiscount) || 0);
    setCouponCode(coupon.couponCode);
    setDiscountAmount(discountValue);
    setDiscountApplied(true);

    try {
      const baseFare = Math.max(0, Number(carData.price) - discountValue);
      if (carData.tripType === "roundTrip") {
        const days = Math.max(0, Number(carData.days) || 0);
        const driverCost = driverrate * days;
        const subTotal = driverCost + baseFare;
        const gst = Math.round(subTotal * 0.05);
        const service = Math.round(subTotal * 0.1);
        const total = subTotal + gst + service;
        setPricing(prev => ({ ...prev, gst, service, total, isCalculated: true }));
        setPartialAmount(Math.round(total * 0.2));
      } else {
        const gst = Math.round(baseFare * 0.05);
        const service = Math.round(baseFare * 0.1);
        const total = baseFare + gst + service;
        setPricing(prev => ({ ...prev, gst, service, total, isCalculated: true }));
        setPartialAmount(Math.round(total * 0.2));
      }
      clearPaymentError();
    } catch (err) {
      // fallback: do nothing
    }
  };

  const clearCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setDiscountApplied(false);
    // Recompute based on original price
    try {
      const price = Math.max(0, Number(carData.price) || 0);
      const gst = Math.round(price * 0.05);
      const service = Math.round(price * 0.1);
      const total = price + gst + service;
      setPricing(prev => ({ ...prev, gst, service, total, isCalculated: true }));
      setPartialAmount(Math.round(total * 0.2));
    } catch {}
  };

  // Manual apply using fetched list (no roundtrip unless needed)
  const handleManualApply = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code"); return; }
    const match = availableCoupons.find(c => String(c.couponCode || "").trim().toUpperCase() === code);
    if (!match) { setCouponError("Invalid or disabled coupon"); return; }
    applyCoupon(match);
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Helper function to show payment error
  const showPaymentErrorMessage = (message: string) => {
    setPaymentError(message);
    setShowPaymentError(true);
    setTimeout(() => setShowPaymentError(false), 5000);
  };

  // Helper function to clear payment errors
  const clearPaymentError = () => {
    setPaymentError("");
    setShowPaymentError(false);
  };

  // Function to create and play success sound using Web Audio API
  const playSuccessSound = () => {
    try {
      // Create a pleasant success sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create a sequence of pleasant tones (C major chord progression)
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      const duration = 0.3;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';

        // Create a pleasant envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        const startTime = audioContext.currentTime + (index * 0.15);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });

    } catch (error) {
      console.log("Could not play success sound:", error);
      // Fallback: try to use a simple beep if Web Audio API fails
      try {
        if (successAudioRef.current) {
          successAudioRef.current.currentTime = 0;
          successAudioRef.current.play().catch(e => console.log("Fallback audio failed:", e));
        }
      } catch (fallbackError) {
        console.log("Fallback audio also failed:", fallbackError);
      }
    }
  };

  // Parse URL parameters on component mount
  useEffect(() => {
    const price = Number(searchParams.get("price")) || 0;
    // Apply discount to base price if already applied via URL
    const baseAfterDiscount = Math.max(0, price - Math.round(price * (discountPercent / 100)));
    const calculatedTotal =
      baseAfterDiscount + Math.round(baseAfterDiscount * 0.1) + Math.round(baseAfterDiscount * 0.05);

    setPricing((prev) => ({
      ...prev,
      total: calculatedTotal,
    }));
    
    setPartialAmount(Math.round(calculatedTotal * 0.2));

    // Prefill form fields if user is logged in - using localStorage instead of cookies
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          setFormData((prev) => ({
            ...prev,
            name: userObj.username || userObj.name || prev.name || "",
            email: userObj.email || prev.email || "",
            phone: userObj.phone || userObj.mobileNo || prev.phone || "",
          }));
        } catch (err) {
          console.log("Failed to parse user from localStorage", err);
        }
      }
    }
  }, [searchParams]);

  // Apply coupon handler
  const handleApplyCoupon = async () => {
    setCouponError("");
    setDiscountApplied(false);
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code");
      return;
    }
    try {
      const res = await fetch(`https://api.worldtriplink.com/discount/validate?code=${encodeURIComponent(couponCode.trim())}`);
      let data: any | null = null;
      if (!res.ok) {
        if (res.status === 410) {
          setCouponError("Coupon expired");
          return;
        }
        // Fallback: fetch all coupons and match locally (handles case/whitespace mismatches)
        try {
          const la = await fetch("https://api.worldtriplink.com/discount/getAll");
          if (la.ok) {
            const all = await la.json();
            const input = couponCode.trim().toUpperCase();
            const today = new Date(); today.setHours(0,0,0,0);
            data = (all || []).find((c: any) => {
              const codeMatch = String(c?.couponCode || "").trim().toUpperCase() === input;
              const enabled = c?.isEnabled === true || c?.isEnabled === "true";
              if (!codeMatch || !enabled) return false;
              if (!c?.expiryDate) return true;
              const d = new Date(String(c.expiryDate)); d.setHours(0,0,0,0);
              return d.getTime() >= today.getTime();
            });
            if (!data) {
              setCouponError("Invalid or disabled coupon");
              return;
            }
          } else {
            setCouponError("Invalid or disabled coupon");
            return;
          }
        } catch {
          setCouponError("Invalid or disabled coupon");
          return;
        }
      } else {
        data = await res.json();
      }
      const percent = data?.discountPercentage != null ? Number(data.discountPercentage) : 0; // backend may not send
      const flatAmount = data?.priceDiscount != null ? Number(data.priceDiscount) : 0; // fallback to flat discount
      const maxDiscountAmount = Number(data?.maxDiscountAmount ?? Number.POSITIVE_INFINITY);
      const minOrderAmount = Number(data?.minOrderAmount ?? 0);

      const base = Number(searchParams.get("price")) || Number(carData.price) || 0;

      if (base < minOrderAmount) {
        setCouponError(`Minimum order amount for this coupon is ₹${minOrderAmount}`);
        setDiscountPercent(0);
        setDiscountAmount(0);
        setDiscountApplied(false);
        return;
      }

      let appliedDiscount = 0;
      if (percent > 0) {
        const rawDiscount = Math.round((base * percent) / 100);
        appliedDiscount = Math.min(rawDiscount, isFinite(maxDiscountAmount) ? maxDiscountAmount : rawDiscount);
      } else if (flatAmount > 0) {
        appliedDiscount = Math.round(flatAmount);
      } else {
        setCouponError("This coupon has no discount configured");
        return;
      }

      const discountedBase = Math.max(0, base - appliedDiscount);

      setDiscountPercent(percent);
      setDiscountAmount(appliedDiscount);
      setDiscountApplied(true);
      setCouponMaxDiscount(maxDiscountAmount);
      setCouponMinOrder(minOrderAmount);

      // Recompute totals with discounted base for one-way/rental immediately
      setPricing((prev) => ({
        ...prev,
        total: discountedBase + Math.round(discountedBase * 0.1) + Math.round(discountedBase * 0.05),
        isCalculated: true,
        service: Math.round(discountedBase * 0.1),
        gst: Math.round(discountedBase * 0.05),
      }));
      setPartialAmount(Math.round((discountedBase + Math.round(discountedBase * 0.1) + Math.round(discountedBase * 0.05)) * 0.2));
    } catch (e) {
      console.error("Coupon validate failed", e);
      setCouponError("Could not validate coupon. Try again");
    }
  };

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Phone number validation: exactly 10 digits required
  const validatePhone = (value: string) => {
    if (!value) {
      return "Phone number is required";
    }
    if (!/^\d{10}$/.test(value)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  // Update phone value and validate on change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, "");
    setFormData({ ...formData, phone: digitsOnly });
    setFormErrors({ ...formErrors, phone: validatePhone(digitsOnly) });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle extra options changes
  const handleExtraChange = (name: string) => {
    setExtras({
      ...extras,
      [name]: !extras[name as keyof typeof extras]
    });
  };
  
  // Centralized function to submit booking data
  const submitBooking = async (bookingData: URLSearchParams) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://api.worldtriplink.com/api/bookingConfirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bookingData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server responded with an error: ${errorText}`);
      }

      const data = await response.json();
      console.log("Booking response:", data);

      if (data.bookingId) {
        setBookingId(data.bookingId);
        setBookingSuccess(true);
        setShowSuccessPopup(true);

        // Play success sound
        playSuccessSound();

        setTimeout(() => {
          setShowSuccessPopup(false);
          router.push("/");
        }, 3000);
      } else {
        throw new Error(data.error || "Booking failed");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(`Failed to complete booking. Please try again. ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handles booking submission for cash payments
  const handleCashBooking = async () => {
    const bookingData = new URLSearchParams({
      cabId: carData.cabId,
      modelName: carData.name,
      modelType: carData.category,
      seats: carData.category === "Ertiga" || carData.category === "SUV" || carData.category === "muv" || carData.category === "MUV" ? "6+1" : "4+1",
      fuelType: "CNG-Diesel",
      availability: "Available",
      price: carData.price.toString(),
      pickupLocation: carData.pickupLocation,
      dropLocation: carData.dropLocation,
      date: carData.date,
      returndate: carData.tripType === "roundTrip" || carData.tripType === "round-trip" ? carData.returnDate || "" : "",
      time: carData.time,
      tripType: carData.tripType,
      distance: carData.distance,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: Math.round(carData.price * 0.1).toString(),
      gst: Math.round(carData.price * 0.05).toString(),
      total: pricing.total.toString(),
      days: carData.days.toString(),
      driverrate: "0",
      userId: userId?.toString() || "",
      packageName: carData.packageName,
      paymentMethod: "cash",
      paymentType: "full",
      paymentStatus: "pending",
      amountPaid: "0",
      remainingAmount: pricing.total.toString(),
    });

    await submitBooking(bookingData);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Add custom CSS for Razorpay modal styling
    const style = document.createElement("style");
    style.textContent = `
      .razorpay-container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }

      .razorpay-checkout-frame {
        border-radius: 12px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      }

      .razorpay-container .header {
        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important;
        border-radius: 12px 12px 0 0 !important;
      }

      .razorpay-container .header .logo {
        border-radius: 8px !important;
        max-height: 40px !important;
      }

      .razorpay-container .methods {
        background: #FAFBFC !important;
      }

      .razorpay-container .method {
        border: 2px solid #E5E7EB !important;
        border-radius: 8px !important;
        margin: 8px !important;
        transition: all 0.2s ease !important;
      }

      .razorpay-container .method:hover {
        border-color: #3B82F6 !important;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15) !important;
      }

      .razorpay-container .method.focused {
        border-color: #3B82F6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      }

      .razorpay-container .btn-primary {
        background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important;
        border: none !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        padding: 12px 24px !important;
        transition: all 0.2s ease !important;
      }

      .razorpay-container .btn-primary:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  // Main handler for all payment types
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    const phoneError = validatePhone(formData.phone);
    setFormErrors({ ...formErrors, phone: phoneError });

    // Clear any existing payment errors
    clearPaymentError();

    if (!formData.name || !formData.email || phoneError || !selectedPaymentMethod) {
      showPaymentErrorMessage("Please fill in all required fields and select a payment option.");
      return;
    }

    if (selectedPaymentMethod !== "Cash" && !paymentType) {
      showPaymentErrorMessage("Please select a payment type (Full or Partial).");
      return;
    }

    if (selectedPaymentMethod === "Cash") {
      await handleCashBooking();
      return;
    }

    if (!razorpayKeyId) {
      showPaymentErrorMessage("Payment service is currently unavailable. Please try again later.");
      return;
    }
    
    const amountToPay = paymentType === "partial" ? partialAmount : pricing.total;
    setIsSubmitting(true);

    try {
      const orderResponse = await axios.post("https://api.worldtriplink.com/api/payments/create-razorpay-order", {
        amount: amountToPay,
      });
      
      const { orderId, keyId } = orderResponse.data;

      if (!keyId || !orderId) {
        console.error("Razorpay not configured properly.");
        showPaymentErrorMessage("Payment service is currently unavailable. Please try again later.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: keyId,
        amount: amountToPay * 100,
        currency: "INR",
        name: "World Trip Link Pvt. Ltd.",
        description: "Cab Booking Payment",
        image: "/images/WTL_Logo.jpeg", // WTL Logo
        order_id: orderId,
        handler: async function (response: any) {
          const bookingData = new URLSearchParams({
            cabId: carData.cabId,
            modelName: carData.name,
            modelType: carData.category,
            seats: carData.category === "Ertiga" || carData.category === "SUV" || carData.category === "muv" || carData.category === "MUV" ? "6+1" : "4+1",
            fuelType: "CNG-Diesel",
            availability: "Available",
            price: carData.price.toString(),
            pickupLocation: carData.pickupLocation,
            dropLocation: carData.dropLocation,
            date: carData.date,
            returndate: carData.tripType === "roundTrip" || carData.tripType === "round-trip" ? carData.returnDate || "" : "",
            time: carData.time,
            tripType: carData.tripType,
            distance: carData.distance,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: Math.round(carData.price * 0.1).toString(),
            gst: Math.round(carData.price * 0.05).toString(),
            total: pricing.total.toString(),
            days: carData.days.toString(),
            driverrate: "0",
            userId: userId?.toString() || "",
            packageName: carData.packageName,
            paymentMethod: "online",
            paymentType: paymentType,
            paymentStatus: "paid",
            amountPaid: amountToPay.toString(),
            remainingAmount: (pricing.total - amountToPay).toString(),
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          await submitBooking(bookingData);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using Net Banking',
                instruments: [
                  {
                    method: 'netbanking'
                  }
                ]
              },
              other: {
                name: 'Other Payment Methods',
                instruments: [
                  {
                    method: 'card'
                  },
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            hide: [
              {
                method: 'emi'
              },
              {
                method: 'paylater'
              },
              {
                method: 'wallet'
              }
            ],
            sequence: ['block.banks', 'block.other'],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        theme: {
          color: "#3B82F6", // Blue theme to match application
          backdrop_color: "rgba(0, 0, 0, 0.6)",
        },
        modal: {
          backdropclose: false, // Prevent accidental closure
          escape: true,
          handleback: true,
          confirm_close: true,
          ondismiss: function() {
            showPaymentErrorMessage("Payment was cancelled. Please try again if you wish to complete the booking.");
            setIsSubmitting(false);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      // Log Razorpay configuration for testing
      console.log("Razorpay initialized with options:", {
        ...options,
        key: "***hidden***" // Hide the actual key in logs
      });

      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        showPaymentErrorMessage("Payment failed. Please try again.");
        setIsSubmitting(false);
      });

      razorpay.on("payment.cancelled", function () {
        console.log("Payment cancelled by user");
        showPaymentErrorMessage("Payment was cancelled. Please try again if you wish to complete the booking.");
        setIsSubmitting(false);
      });

      razorpay.open();
      // setIsSubmitting(false) is called inside the handlers
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      showPaymentErrorMessage("Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Calculate total with extras
  const calculateTotalWithExtras = () => {
    let total = pricing.total;
    if (extras.pet) total += 500;
    if (extras.carrier) total += 100;
    return total;
  };

  // Calculate fare breakup details
  const calculateFareBreakup = () => {
    const baseFare = Number(carData.price);
    const serviceCharge = Math.round(baseFare * 0.1);
    const gst = Math.round(baseFare * 0.05);
    const totalBeforeExtras = baseFare + serviceCharge + gst;
    const totalWithExtras = calculateTotalWithExtras();
    
    return {
      baseFare,
      serviceCharge,
      gst,
      totalBeforeExtras,
      totalWithExtras,
      extrasCost: totalWithExtras - totalBeforeExtras
    };
  };

  const fareBreakup = calculateFareBreakup();

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl p-5 mb-8 text-center shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-center mb-3 md:mb-0">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-bold text-lg">Hurray! 20% off on all rides</p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-sm font-medium">Offer ends in:</span>
              <div className="flex space-x-2">
                <div className="bg-white bg-opacity-20 rounded-lg py-2 px-3">
                  <span className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <p className="text-xs">HRS</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg py-2 px-3">
                  <span className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <p className="text-xs">MINS</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg py-2 px-3">
                  <span className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <p className="text-xs">SECS</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl relative mb-8 shadow-lg"
            role="alert"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <strong className="font-bold text-xl">🎉 Congratulations!</strong>
                </div>
                <div className="text-green-700 mt-1">
                  <p className="font-semibold text-base mb-2">Your cab booking has been confirmed successfully!</p>
                  <p className="text-sm">
                    <span className="font-medium">Booking ID:</span> <span className="bg-green-100 px-2 py-1 rounded font-mono font-bold">{bookingId}</span>
                  </p>
                  <p className="text-sm mt-2">
                    📧 A confirmation email has been sent with your booking details.<br/>
                    🚗 Get ready for your comfortable journey with World Trip Link!
                  </p>
                  <p className="text-xs mt-2 text-green-600">Redirecting to home page...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Error Message */}
        {showPaymentError && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl relative mb-6 flex items-center shadow-lg"
            role="alert"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-bold text-lg">Payment Error!</strong>
                <span className="block sm:inline ml-2 text-base">{paymentError}</span>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentError(false)}
              className="absolute top-0 bottom-0 right-0 px-5 py-4"
            >
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details and Trip Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Car Details Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-7">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-52 h-36 relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                      {carData.image ? (
                        <Image
                          src={carData.image}
                          alt={carData.name || "Car Image"}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-lg">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{carData.name || "Car"}</h2>
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="ml-3 text-gray-600 font-medium">★ 4.6 <span className="text-sm">(548 ratings)</span></span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {carData.category === "Ertiga" || carData.category === "SUV" || carData.category === "muv" || carData.category === "MUV" 
                            ? "6+1 seater" 
                            : "4+1 seater"}
                        </span>
                      </div>
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                        </svg>
                        <span className="text-sm font-medium">AC</span>
                      </div>
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-sm font-medium">Sanitized</span>
                      </div>
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">GPS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions Section */}
            {/* <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Inclusions & Exclusions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h3 className="font-bold text-green-700 text-lg mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Inclusions
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Toll Charges</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">State Tax</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">156 Km</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                  <h3 className="font-bold text-red-700 text-lg mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Exclusions
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">Night Charges</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">Parking Charges</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">Waiting Charges (After 45 mins ₹100 per 30 mins)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">Fare Beyond 156 Km ₹13/Km</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}

            {/* Choose Extra Section
            <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Choose Extra</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                    extras.pet ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  onClick={() => handleExtraChange('pet')}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={extras.pet}
                      onChange={() => handleExtraChange('pet')}
                      className="mt-1 mr-4 h-5 w-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Pet Option</h3>
                      <p className="text-gray-600 mt-2">Add a pet-friendly option for a comfortable ride for your furry friend.</p>
                      <p className="text-orange-600 font-bold text-xl mt-3">₹500</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                    extras.carrier ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                  }`}
                  onClick={() => handleExtraChange('carrier')}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={extras.carrier}
                      onChange={() => handleExtraChange('carrier')}
                      className="mt-1 mr-4 h-5 w-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Carrier Option</h3>
                      <p className="text-gray-600 mt-2">Add a carrier roof rack for extra luggage.</p>
                      <p className="text-orange-600 font-bold text-xl mt-3">₹100</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Trip Details Section */}
            <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Trip Details</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="pickup"
                        value={carData.pickupLocation}
                        readOnly
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop-off Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="dropoff"
                        value={carData.dropLocation}
                        readOnly
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex space-x-4">
                      {['Male', 'Female', 'Others'].map((gender) => (
                        <label key={gender} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-gray-700">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className={`flex-1 px-4 py-3 border ${
                          formErrors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-r-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter 10-digit phone number"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        disabled={isSubmitting}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks (Optional)
                  </label>
                  <textarea
                    name="remarks"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special requests or instructions"
                    value={formData.remarks}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="flex items-center">
                  
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label className="ml-3 block text-gray-700">
                    By proceeding to book, I agree to WTL Toursim Private Limited <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>, <a href="#" className="text-blue-600 hover:underline font-medium">User Agreement</a>, and <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>.
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Live Pickup Location is starting within minutes.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:sticky lg:top-6 border border-gray-100 z-20 isolate pointer-events-auto overflow-hidden">
              {/* Trip Information Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Trip Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trip Type</span>
                    <span className="font-medium capitalize">{carData.tripType.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{carData.date}</span>
                  </div>
                  {carData.tripType === "roundTrip" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return Date</span>
                      <span className="font-medium">{carData.returnDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{carData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup</span>
                    <span className="font-medium text-right">{carData.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drop-off</span>
                    <span className="font-medium text-right">{carData.dropLocation}</span>
                  </div>
                  {carData.tripType === "rental" && carData.packageName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package</span>
                      <span className="font-medium">{carData.packageName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance</span>
                    <span className="font-medium">{carData.distance} km</span>
                  </div>
                </div>
              </div>

              {/* Coupons Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l2-2 4 4M7 7h10a2 2 0 012 2v0a2 2 0 01-.586 1.414l-8 8A2 2 0 019 19H7a2 2 0 01-2-2v-2a2 2 0 01.586-1.414l8-8A2 2 0 0115 5" />
                  </svg>
                  Coupons
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleManualApply}
                    className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!couponCode.trim() || isSubmitting}
                  >
                    Apply
                  </button>
                </div>
                {discountApplied && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-semibold text-green-700">Applied: {couponCode}</span>
                      <span className="text-sm text-green-700">-₹{discountAmount}</span>
                    </div>
                    <button type="button" onClick={clearCoupon} className="text-xs font-medium text-green-700 hover:text-green-800 hover:underline">Remove</button>
                  </div>
                )}
                {couponError && (
                  <p className="text-sm text-red-600 mt-2">{couponError}</p>
                )}
                {availableCoupons && availableCoupons.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableCoupons.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => applyCoupon(c)}
                        className={`text-left border-2 rounded-xl p-3 transition ${
                          couponCode.trim().toUpperCase() === String(c.couponCode || "").trim().toUpperCase() && discountApplied
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{c.couponCode}</span>
                          <span className="text-green-700 font-bold">-₹{c.priceDiscount}</span>
                        </div>
                        {c.expiryDate && (
                          <p className="text-xs text-gray-500 mt-1">Valid till {c.expiryDate}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fare Breakup Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Fare Breakup
                </h3>
                <div className="space-y-3">
                  {/* Round Trip Invoice */}
                  {carData.tripType === "roundTrip" &&
                    (() => {
                      const baseFare = Number(carData.price);
                      const numberOfDays = Number(carData.days);
                      const driverCost = driverrate * numberOfDays;
                      const appliedDisc = discountApplied ? Number(discountAmount || 0) : 0;
                      const discountedBaseFare = Math.max(0, baseFare - appliedDisc);
                      const subTotal = driverCost + discountedBaseFare;
                      const gstAmount = subTotal * 0.05;
                      const serviceCharge = subTotal * 0.1;
                      const totalAmount = subTotal + gstAmount + serviceCharge;

                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base Fare</span>
                            <span className="font-medium">₹{baseFare}</span>
                          </div>
                          {discountApplied && discountAmount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Discount ({discountPercent}%{Number.isFinite(couponMaxDiscount) ? `, max ₹${couponMaxDiscount}` : ""})</span>
                              <span className="font-medium text-green-600">-₹{discountAmount}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Driver Bhata/Day</span>
                            <span className="font-medium">₹{driverrate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Days</span>
                            <span className="font-medium">{numberOfDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount (DriverRate+BaseFare)</span>
                            <span className="font-medium">₹{subTotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">GST (5%)</span>
                            <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service Charge (10%)</span>
                            <span className="font-medium">₹{serviceCharge.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-300 pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="font-bold text-lg">Total Amount</span>
                              <span className="font-bold text-xl text-blue-600">₹{totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                  {/* One Way Invoice */}
                  {carData.tripType === "oneWay" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-medium">₹{carData.price}</span>
                      </div>
                      {discountApplied && discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount ({discountPercent}%{Number.isFinite(couponMaxDiscount) ? `, max ₹${couponMaxDiscount}` : ""})</span>
                          <span className="font-medium text-green-600">-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge (10%)</span>
                        <span className="font-medium">
                          ₹
                          {pricing.isCalculated
                            ? pricing.service
                            : (() => {
                                const base = Math.max(0, Number(carData.price) - Number(discountAmount || 0));
                                return Math.round(base * 0.1);
                              })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (5%)</span>
                        <span className="font-medium">
                          ₹
                          {pricing.isCalculated
                            ? pricing.gst
                            : (() => {
                                const base = Math.max(0, Number(carData.price) - Number(discountAmount || 0));
                                return Math.round(base * 0.05);
                              })()}
                        </span>
                      </div>
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">Total Amount</span>
                          <span className="font-bold text-xl text-blue-600">
                            ₹
                            {pricing.isCalculated
                              ? pricing.total
                              : (() => {
                                  const base = Math.max(0, Number(carData.price) - Number(discountAmount || 0));
                                  return base + Math.round(base * 0.1) + Math.round(base * 0.05);
                                })()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Rental Invoice */}
                  {carData.tripType === "rental" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Amount</span>
                        <span className="font-medium">₹{carData.price}</span>
                      </div>
                      {discountApplied && discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount ({discountPercent}%{Number.isFinite(couponMaxDiscount) ? `, max ₹${couponMaxDiscount}` : ""})</span>
                          <span className="font-medium text-green-600">-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (5%)</span>
                        <span className="font-medium">
                          ₹{(() => { const base = Math.max(0, Number(carData.price) - Number(discountAmount || 0)); return Math.round(base * 0.05); })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge (10%)</span>
                        <span className="font-medium">
                          ₹{(() => { const base = Math.max(0, Number(carData.price) - Number(discountAmount || 0)); return Math.round(base * 0.1); })()}
                        </span>
                      </div>
                      <div className="border-t border-gray-300 pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg">Total Amount</span>
                          <span className="font-bold text-xl text-blue-600">
                            ₹
                            {(() => { const base = Math.max(0, Number(carData.price) - Number(discountAmount || 0)); return base + Math.round(base * 0.05) + Math.round(base * 0.1); })()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                    <p className="font-semibold text-amber-800 mb-1">Tolls and Interstate Charges</p>
                    <p className="text-amber-700">Extra charges apply – pay the driver directly based on your route</p>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                    <p className="font-semibold text-amber-800 mb-1">Parking Charges</p>
                    <p className="text-amber-700">Extra charges apply for paid parking</p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                    <p className="font-semibold text-green-800">✓ Includes all taxes</p>
                  </div>
                </div>




              </div>

              {/* Payment Options */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Payment Options
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    htmlFor="payment-upi"
                    className={`block w-full relative select-none cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 shadow-sm ${
                      selectedPaymentMethod === "UPI"
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="radio"
                      id="payment-upi"
                      name="paymentMethod"
                      value="UPI"
                      checked={selectedPaymentMethod === "UPI"}
                      onChange={(e) => {
                        setSelectedPaymentMethod(e.target.value);
                        setPaymentType("");
                        clearPaymentError(); // Clear any existing payment errors
                      }}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className="text-sm font-semibold">Online</div>
                    <p className="text-xs text-gray-500">
                      RazorPay
                    </p>
                  </label>

                  
                  <label
                    htmlFor="payment-cash"
                    className={`block w-full relative select-none cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 shadow-sm ${
                      selectedPaymentMethod === "Cash"
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="radio"
                      id="payment-cash"
                      name="paymentMethod"
                      value="Cash"
                      checked={selectedPaymentMethod === "Cash"}
                      onChange={(e) => {
                        setSelectedPaymentMethod(e.target.value);
                        setPaymentType("full"); // Cash is always full payment
                        clearPaymentError(); // Clear any existing payment errors
                      }}
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div className="text-sm font-semibold">Cash</div>
                    <p className="text-xs text-gray-500">Pay to Driver</p>
                  </label>
                </div>
              </div>

              {/* Payment Type Options (visible only for online payments) */}
              {selectedPaymentMethod !== "" && selectedPaymentMethod !== "Cash" && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Payment Type
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      htmlFor="payment-full"
                      className={`block w-full relative select-none cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 shadow-sm ${
                        paymentType === "full"
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <input
                        type="radio"
                        id="payment-full"
                        name="paymentType"
                        value="full"
                        checked={paymentType === "full"}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div className="text-sm font-semibold">Full Payment</div>
                      <p className="text-xs text-gray-500">
                        ₹{pricing.total.toFixed(2)}
                      </p>
                    </label>
                    <label
                      htmlFor="payment-partial"
                      className={`block w-full relative select-none cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 shadow-sm ${
                        paymentType === "partial"
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <input
                        type="radio"
                        id="payment-partial"
                        name="paymentType"
                        value="partial"
                        checked={paymentType === "partial"}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div className="text-sm font-semibold">
                        Partial Payment (20%)
                      </div>
                      <p className="text-xs text-gray-500">
                        ₹{partialAmount.toFixed(2)}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedPaymentMethod || (selectedPaymentMethod !== "Cash" && !paymentType)}
                  className={`w-full relative overflow-hidden ${
                    isSubmitting
                      ? "bg-blue-600"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                  } text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Book Now"
                  )}
                </button>
              </div>
            </div>
          </div>


        </div>

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                <svg
                  className="absolute inset-0 w-full h-full text-white p-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17L4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Booking Successful!
              </h3>
              <p className="text-gray-600 mb-1">Your booking ID: <span className="font-bold text-blue-600">{bookingId}</span></p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to homepage...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingInvoice() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}