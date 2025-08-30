"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
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

// Ensure the Razorpay script is loaded in your root layout or document file.
declare global {
  interface Window {
    Razorpay: any;
  }
}

function InvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Car data loaded via URL parameters
  const [carData, setCarData] = useState<CarData>({
    cabId: searchParams.get("cabId") || "",
    name: searchParams.get("name") || "",
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
    const calculatedTotal =
      price + Math.round(price * 0.1) + Math.round(price * 0.05);

    setPricing((prev) => ({
      ...prev,
      total: calculatedTotal,
    }));
    
    setPartialAmount(Math.round(calculatedTotal * 0.2));

    // Prefill form fields if user is logged in
    if (typeof window !== "undefined") {
      const userStr = Cookies.get("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          setFormData((prev) => ({
            name: userObj.username || userObj.name || prev.name || "",
            email: userObj.email || prev.email || "",
            phone: userObj.phone || userObj.mobileNo || prev.phone || "",
          }));
        } catch (err) {
          console.log("Failed to parse user from cookie", err);
        }
      }
    }
  }, [searchParams]);

  const userId = Cookies.get("userId");

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
      seats: carData.category === "SUV" || carData.category === "muv" ? "6+1" : "4+1",
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
            seats: carData.category === "SUV" || carData.category === "muv" ? "6+1" : "4+1",
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

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Success Message */}
        {bookingSuccess && (
          <div
            className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 text-green-800 px-6 py-4 rounded-lg relative mb-6 shadow-lg"
            role="alert"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <strong className="font-bold text-xl text-green-700">🎉 Congratulations!</strong>
                </div>
                <div className="text-green-700">
                  <p className="font-semibold mb-1">Your cab booking has been confirmed successfully!</p>
                  <p className="text-sm">
                    <span className="font-medium">Booking ID:</span> <strong className="bg-green-200 px-2 py-1 rounded font-mono">{bookingId}</strong>
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
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center"
            role="alert"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-bold">Payment Error!</strong>
                <span className="block sm:inline ml-1">{paymentError}</span>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentError(false)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}



        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Booking Invoice
          </h1>
          <p className="mt-2 text-gray-600">
            Complete your booking details below
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Left Column – Car Details */}
            <div className="p-6 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Cab Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-56 h-40 relative rounded-xl overflow-hidden shadow-2xl">
                      {carData.image ? (
                        <Image
                          src={carData.image}
                          alt={carData.name || "Car Image"}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-400">
                            No image available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-blue-200 text-xs">Model Type</p>
                      <p className="font-semibold">{carData.category}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-blue-200 text-xs">Seats</p>
                      <p className="font-semibold">
                        {carData.category === "SUV" ||
                        carData.category === "muv"
                          ? "6+1"
                          : "4+1"}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-blue-200 text-xs">Fuel Type</p>
                      <p className="font-semibold">CNG-Diesel</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <p className="text-blue-200 text-xs">Availability</p>
                      <p className="font-semibold">Available</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <div className="space-y-2">
                      {/* Round Trip Invoice */}
                      {carData.tripType === "roundTrip" &&
                        (() => {
                          const baseFare = Number(carData.price);
                          const numberOfDays = Number(carData.days);
                          const driverCost = driverrate * numberOfDays;
                          const subTotal = driverCost + baseFare;
                          const gstAmount = subTotal * 0.05;
                          const serviceCharge = subTotal * 0.1;
                          const totalAmount = subTotal + gstAmount + serviceCharge;

                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">
                                  Distance/Day:
                                </span>
                                <span className="font-semibold">300km</span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">
                                  Driver Bhata/Day
                                  <br />
                                  <small className="text-xs">
                                    (Fixed 300km/day in Round Trip)
                                  </small>
                                </span>
                                <span className="font-semibold">
                                  ₹{driverrate}
                                </span>
                              </div>

                              <div className="flex items-center justify-center gap-5 my-6">
                                <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                                <h1 className="text-2xl font-bold text-white px-4">
                                  Invoice
                                </h1>
                                <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">
                                  Base Fare
                                </span>
                                <span className="font-semibold">
                                  ₹{baseFare}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">
                                  Driver Rate (DriverRate * days)
                                </span>
                                <span className="font-semibold">
                                  ₹{driverCost}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">
                                  Amount(DriverRate+BaseFare)
                                </span>
                                <span className="font-semibold">
                                  ₹{subTotal}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">GST(5%)</span>
                                <span className="font-semibold">
                                  ₹{gstAmount.toFixed(2)}
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-blue-200">
                                  Service Charge(10%)
                                </span>
                                <span className="font-semibold">
                                  ₹{serviceCharge.toFixed(2)}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-xl mt-3 pt-3 border-t border-white/20">
                                <span className="font-bold">
                                  Total Amount:
                                </span>
                                <span className="font-bold text-2xl">
                                  ₹ {totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </>
                          );
                        })()}

                      {/* One Way Invoice */}
                      {carData.tripType === "oneWay" && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">Base Fare</span>
                            <span className="font-semibold">
                              ₹{carData.price}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">
                              Service Charge:
                            </span>
                            <span className="font-semibold">
                              ₹
                              {pricing.isCalculated
                                ? pricing.service
                                : Math.round(carData.price * 0.1)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">GST:</span>
                            <span className="font-semibold">
                              ₹
                              {pricing.isCalculated
                                ? pricing.gst
                                : Math.round(carData.price * 0.05)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center text-xl mt-3 pt-3 border-t border-white/20">
                            <span className="font-bold">Total Amount:</span>
                            <span className="font-bold text-2xl">
                              ₹
                              {pricing.isCalculated
                                ? pricing.total
                                : carData.price +
                                  Math.round(carData.price * 0.1) +
                                  Math.round(carData.price * 0.05)}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Rental Invoice */}
                      {carData.tripType === "rental" && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">Package:</span>
                            <span className="font-semibold">
                              {carData.packageName}
                            </span>
                          </div>
                          
                          {carData.estimatedTravelTime && (
                            <div className="flex justify-between items-center">
                              <span className="text-blue-200">
                                Estimated Travel Time:
                              </span>
                              <span className="font-semibold">
                                {carData.estimatedTravelTime}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-center gap-5 my-6">
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                            <h1 className="text-2xl font-bold text-white px-4">
                              Invoice
                            </h1>
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">Base Amount:</span>
                            <span className="font-semibold">
                              ₹{carData.price}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">GST (5%):</span>
                            <span className="font-semibold">
                              ₹{Math.round(carData.price * 0.05)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">
                              Service Charge (10%):
                            </span>
                            <span className="font-semibold">
                              ₹{Math.round(carData.price * 0.1)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xl mt-3 pt-3 border-t border-white/20">
                            <span className="font-bold">Total Amount:</span>
                            <span className="font-bold text-2xl">
                              ₹
                              {carData.price +
                                Math.round(carData.price * 0.05) +
                                Math.round(carData.price * 0.1)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column – Trip Information & Booking Form */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Trip Information
              </h2>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Pickup Location</p>
                    <p className="font-medium text-gray-800">
                      {carData.pickupLocation}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Drop Location</p>
                    <p className="font-medium text-gray-800">
                      {carData.dropLocation}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">{carData.date}</p>
                  </div>
                  {carData.tripType === "roundTrip" && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Return Date</p>
                      <p className="font-medium text-gray-800">
                        {carData.returnDate}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">{carData.time}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Trip Type</p>
                    <p className="font-medium text-gray-800">
                      {carData.tripType}
                    </p>
                  </div>
                  {carData.tripType === "rental" && carData.packageName && (
                    <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                      <p className="text-xs text-gray-500">Package</p>
                      <p className="font-medium text-gray-800">
                        {carData.packageName}
                      </p>
                    </div>
                  )}
                  {carData.tripType === "rental" && carData.estimatedTravelTime && (
                    <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                      <p className="text-xs text-gray-500">
                        Estimated Travel Time
                      </p>
                      <p className="font-medium text-gray-800">
                        {carData.estimatedTravelTime}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="font-medium text-gray-800">
                      {carData.distance} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    className={`w-full px-3 py-2 border-2 ${
                      formErrors.phone ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your 10-digit phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Options */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Payment Options
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    htmlFor="payment-upi"
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all duration-200 ${
                      selectedPaymentMethod === "UPI"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
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
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className="text-sm font-semibold">Online</div>
                    <p className="text-xs text-gray-500">
                      RazorPay
                    </p>
                  </label>

                  
                  <label
                    htmlFor="payment-cash"
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all duration-200 ${
                      selectedPaymentMethod === "Cash"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
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
                      className="hidden"
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Payment Type
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      htmlFor="payment-full"
                      className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all duration-200 ${
                        paymentType === "full"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        id="payment-full"
                        name="paymentType"
                        value="full"
                        checked={paymentType === "full"}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <div className="text-sm font-semibold">Full Payment</div>
                      <p className="text-xs text-gray-500">
                        ₹{pricing.total.toFixed(2)}
                      </p>
                    </label>
                    <label
                      htmlFor="payment-partial"
                      className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all duration-200 ${
                        paymentType === "partial"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        id="payment-partial"
                        name="paymentType"
                        value="partial"
                        checked={paymentType === "partial"}
                        onChange={(e) => setPaymentType(e.target.value)}
                        className="hidden"
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

        {/* Footer / Additional Information */}
        <div className="mt-4 text-center text-gray-600">
          <p className="text-xs">
            By clicking "Book Now" you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Privacy Policy
            </a>
          </p>
        </div>

        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center animate-fade-in">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-scale-in"></div>
                <svg
                  className="absolute inset-0 w-full h-full text-white animate-draw-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17L4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Booking Successful!
              </h3>
              <p className="text-gray-600 mb-4">Your booking ID: {bookingId}</p>
              <p className="text-sm text-gray-500">
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