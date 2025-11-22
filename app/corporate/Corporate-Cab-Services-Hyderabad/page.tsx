"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import CabBookingForm from "@/components/CabBookingForm";
import BusBookingForm from "@/components/BusBookingForm";
import HotelBookingForm from "@/components/HotelBookingForm";
import FlightBookingForm from "@/components/FlightBookingForm";
import HomestaysBookingForm from "@/components/HomestaysBookingForm";
import HolidayBookingForm from "@/components/HolidayBookingForm";
import FloatingIcons from "@/components/FloatingIcons";
import InquiryPopup from "@/components/InquiryPopup";
import InquiryForm from "@/components/InquiryForm";

// Counter hook for animated numbers
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const startTime = Date.now();
            const animate = () => {
              const currentTime = Date.now();
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              setCount(Math.floor(target * progress));
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(target);
              }
            };
            animate();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elementRef };
};

// FAQ Item Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-medium text-gray-900">{question}</h2>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function HyderabadCorporateCabServicePage() {
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("cabs");
  const [isInquiryFormOpen, setIsInquiryFormOpen] = useState(false);

  // Handler for opening inquiry form
  const handleInquiryClick = () => {
    setIsInquiryFormOpen(true);
  };

  // Handler for closing inquiry form
  const handleInquiryClose = () => {
    setIsInquiryFormOpen(false);
  };

  // Initialize counters
  const personalCabsCounter = useCounter(30);
  const registeredCabsCounter = useCounter(500);
  const citiesCounter = useCounter(100);
  const officesCounter = useCounter(50);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderBookingForm = () => {
    switch (activeTab) {
      case "cabs":
        return <CabBookingForm />;
      case "buses":
        return <BusBookingForm />;
      case "flights":
        return <FlightBookingForm />;
      case "hotels":
        return <HotelBookingForm />;
      case "homestays":
        return <HomestaysBookingForm />;
      case "holiday":
        return <HolidayBookingForm />;
      default:
        return <CabBookingForm />;
    }
  };

  // Removed manual DOM mutation for theme to prevent hydration mismatch.
  // Theme is managed globally via ThemeProvider in app/layout.tsx.

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 max-w-lg w-full">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                There was an error loading this page. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>
          Corporate Cab Service in Hyderabad | WTL Tourism Pvt Ltd
        </title>
        <meta
          name="description"
          content="WTL Tourism Pvt. Ltd. offers reliable corporate cab services in Hyderabad, providing safe, cost-effective, and professional employee transportation solutions since 2016. Serving 50+ corporate offices with 500+ registered cabs across HITEC City, Gachibowli, Madhapur, and beyond."
        />
        <link
          rel="preload"
          href="/images/hyderabad.jpg"
          as="image"
        />
        <link
          rel="canonical"
          href="https://www.worldtriplink.com/corporate/Corporate-Cab-Service-Hyderabad"
        />
        <meta name="author" content="WTL Tourism" />
        <meta
          name="keywords"
          content="corporate cab service in Hyderabad, employee transportation services in Hyderabad, corporate employee transport services in Hyderabad, staff shuttle service in Hyderabad, best office cab service in Hyderabad, monthly corporate cab rental Hyderabad, corporate travel management Hyderabad, employee cab service Hyderabad, corporate taxi Hyderabad, staff pickup and drop Hyderabad"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navbar onTabChange={handleTabChange} disableForm={true} />
      <FloatingIcons />

      {/* Hero Section */}
      <div className="relative min-h-[550px] w-full flex items-stretch">
        <div className="absolute inset-0">
          <Image
            src="/images/hyderabad.jpg"
            alt="Hyderabad Corporate Cab Service"
            fill
            className="object-cover"
            priority
            onError={() => setHasError(true)}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 w-full">
          <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 w-full mx-auto flex flex-col justify-center">
            <div className="text-center mb-8 px-2 sm:px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Corporate Cab Service in Hyderabad
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Safe, Reliable & Cost-Effective Employee Transportation
              </p>
            </div>
            <div className="w-full max-w-full sm:max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto">
              {renderBookingForm()}
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
              <strong>Corporate cab service in Hyderabad</strong> is not just about moving people from one place to another it’s about ensuring employees travel safely, arrive on time, and feel valued by their employers. Established in <strong>2016 in Pune, Worldtriplink (WTL Tourism Pvt Ltd)</strong> has grown into one of India’s most <strong>trusted corporate cab service providers</strong>, now with strong operations in <strong>Mumbai</strong> and <strong>Hyderabad</strong>.
            </p>
            <br />
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
              From a modest start with a handful of vehicles, WTL today manages 500+ registered cabs, services 50+ corporate offices, and operates across 100+ cities. In Hyderabad, WTL has become a preferred choice for IT companies, multinational corporations, and startups that need professional, reliable, and scalable employee transportation solutions.
            </p>
            <br />
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
              Our reputation rests on three pillars: <strong>affordability, safety, and reliability</strong>. With <strong>30+ personal cabs</strong>, shared and exclusive options, real time tracking, and eco friendly vehicles, WTL ensures that your employees commute with <strong>comfort and peace of mind</strong>.
            </p>
          </div>
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
                <div className="text-center mb-8">
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
                  <strong>Corporate cab service in Hyderabad</strong> is not just about moving people from one place to another it’s about ensuring employees travel safely, arrive on time, and feel valued by their employers. Established in <strong>2016 in Pune, Worldtriplink (WTL Tourism Pvt Ltd)</strong> has grown into one of India’s most <strong>trusted corporate cab service providers</strong>, now with strong operations in <strong>Mumbai</strong> and <strong>Hyderabad</strong>.                  </p>
                  <br />
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
                  From a modest start with a handful of vehicles, WTL today manages 500+ registered cabs, services 50+ corporate offices, and operates across 100+ cities. In Hyderabad, WTL has become a preferred choice for IT companies, multinational corporations, and startups that need professional, reliable, and scalable employee transportation solutions.                  </p>
                  <br />
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
                  Our reputation rests on three pillars: <strong>affordability, safety, and reliability</strong>. With <strong>30+ personal cabs</strong>, shared and exclusive options, real time tracking, and eco friendly vehicles, WTL ensures that your employees commute with <strong>comfort and peace of mind</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50 w-full">
        {/* About WTL Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 w-full mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative inline-block">
                About WTL Tourism Pvt Ltd A Trusted Corporate Mobility Partner
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
                  Worldtriplink (WTL Tourism Pvt Ltd) was founded in 2016 in Pune
                  with a clear mission: to make corporate transportation smarter,
                  safer, and stress-free for Indian businesses. Over the years,
                  we have become a trusted partner for companies in IT hubs,
                  industrial parks, banks, hospitals, and consulting firms.
                </p>
              </div>
            </div>

            <div className="w-full max-w-7xl mx-auto">
              <div className="mb-8">
                <h4 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative inline-block">
                  Key Company Highlights:
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-blue-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">Founded in 2016 in Pune</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-blue-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h4
                      className="text-2xl font-bold text-gray-900 mb-2"
                      ref={personalCabsCounter.elementRef}
                    >
                      {personalCabsCounter.count}+
                    </h4>
                    <p className="text-gray-600">Personal Cabs for executives</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-purple-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h4
                      className="text-2xl font-bold text-gray-900 mb-2"
                      ref={registeredCabsCounter.elementRef}
                    >
                      {registeredCabsCounter.count}+
                    </h4>
                    <p className="text-gray-600">Registered Cabs across India</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-green-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h4
                      className="text-2xl font-bold text-gray-900 mb-2"
                      ref={citiesCounter.elementRef}
                    >
                      {citiesCounter.count}+
                    </h4>
                    <p className="text-gray-600">
                      Operations in Cities with focus on Mumbai & Hyderabad
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-red-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4
                      className="text-2xl font-bold text-gray-900 mb-2"
                      ref={officesCounter.elementRef}
                    >
                      {officesCounter.count}+
                    </h4>
                    <p className="text-gray-600">Serving Corporate Offices</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-orange-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Affordable pricing with zero hidden charges
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-teal-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Punctual, reliable service with real-time tracking
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-pink-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Safety & hygiene guaranteed Sanitized, AC vehicles
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-indigo-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">Shared & exclusive travel options</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-lime-50 to-lime-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-lime-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Door-to-door pick-up/drop with multi-location support
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-amber-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Monthly & weekly packages tailored for corporate needs
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-cyan-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4 2 2 0 002 2m10 0h2a2 2 0 002-2v-3a2 2 0 110-4 2 2 0 00-2-2h-2m-5 0a9 9 0 100 18 9 9 0 000-18zm0 0a9 9 0 019 9"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      Eco-friendly & fuel-efficient rides
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-cyan-700 mb-4">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4 2 2 0 002 2m10 0h2a2 2 0 002-2v-3a2 2 0 110-4 2 2 0 00-2-2h-2m-5 0a9 9 0 100 18 9 9 0 000-18zm0 0a9 9 0 019 9"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600">
                      GST-compliant billing & easy monthly invoicing
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-12 text-gray-600">
                For Hyderabad-based companies, WTL isn’t just a cab provider—it is
                a <strong>strategic HR and admin partner</strong> that improves{" "}
                <strong>attendance, punctuality, and employee satisfaction</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Service Offerings
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-600 mb-4">
                WTL offers more than just cabs it delivers{" "}
                <strong>complete employee commute management solutions</strong>.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Staff pick-up & drop</strong> services across Hyderabad.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Shared & exclusive cabs</strong> for flexible needs.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Staff shuttle service for companies</strong> with large
                    workforce clusters.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Monthly corporate cab rentals</strong> for predictable
                    budgeting.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Outstation travel management</strong> for meetings and
                    conferences.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Corporate fleet management</strong> with real-time
                    monitoring.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>Eco-friendly travel</strong> with fuel-efficient rides.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    <strong>24/7 customer support</strong> for employees and admin
                    teams.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Corporate Cab Service Provider Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Corporate Cab Service Provider in Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                As a <strong>leading corporate cab service provider in Hyderabad</strong>, WTL
                understands the unique challenges businesses face in managing daily
                commutes. Hyderabad’s <strong>HITEC City, Gachibowli, Madhapur, and Financial District</strong> are
                home to hundreds of IT companies and multinational corporations.
                Ensuring employees reach on time is not just a convenience—it
                directly impacts <strong>productivity and workplace culture</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>WTL offers:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Customized transportation packages</strong> for different
                    workforce sizes.
                  </li>
                  <li>
                    <strong>Scalable fleets</strong> that can grow as your company
                    expands.
                  </li>
                  <li>
                    <strong>Data-driven route optimization</strong> to reduce travel
                    time.
                  </li>
                  <li>
                    <strong>Trusted drivers</strong> who are trained,
                    background-verified, and experienced.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                When companies choose WTL, they don’t just get a cab service—they
                gain a <strong>long-term mobility partner</strong> trusted for
                professionalism and reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Employee Transportation Company Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Employee Transportation Company Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                As a specialized <strong>employee transportation company in Hyderabad</strong>,
                WTL designs commute solutions that improve both{" "}
                <strong>efficiency and employee well-being</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>We focus on:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Safe late-night drops</strong> for women employees working
                    in IT & BPO shifts.
                  </li>
                  <li>
                    <strong>Comfortable AC vehicles</strong> that ensure stress-free
                    rides.
                  </li>
                  <li>
                    <strong>Reduced absenteeism and late arrivals</strong> by ensuring
                    punctuality.
                  </li>
                  <li>
                    <strong>Fuel-efficient routes</strong> with GPS optimization.
                  </li>
                  <li>
                    <strong>Fuel-efficient and eco-friendly cabs</strong> that align
                    with CSR goals.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>Case Insight:</strong> A Hyderabad-based BPO reduced{" "}
                <strong>employee attrition by 18%</strong> after partnering with WTL
                for structured staff commute solutions. Employees cited{" "}
                <strong>safety and comfort</strong> as the top reasons for improved
                job satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* Staff Shuttle Service Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Staff Shuttle Service for Companies Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                Hyderabad companies often need <strong>bulk employee movement</strong> from
                residential clusters like <strong>Kondapur, Kukatpally, and Secunderabad</strong>{" "}
                to corporate hubs. WTL’s{" "}
                <strong>staff shuttle service for companies in Hyderabad</strong>{" "}
                addresses this challenge effectively.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Features of Shuttle Service:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Fixed-route shared cabs and vans</strong> for cost
                    efficiency.
                  </li>
                  <li>
                    <strong>Real-time GPS tracking</strong> for security.
                  </li>
                  <li>
                    <strong>Multi-location pick-ups</strong> to accommodate large
                    teams.
                  </li>
                  <li>
                    <strong>Automated billing & reporting</strong> for HR
                    convenience.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                By outsourcing shuttle services, companies{" "}
                <strong>save 30-40% in transport costs</strong> while employees
                enjoy <strong>hassle-free, punctual commutes</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Best Office Cab Service Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Best Office Cab Service in Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                When it comes to being the{" "}
                <strong>best office cab service in Hyderabad</strong>, WTL stands
                out because of:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Reliability:</strong> Over 98% on-time performance across
                  Hyderabad routes.
                </li>
                <li>
                  <strong>Affordability:</strong> Transparent, fixed corporate
                  packages.
                </li>
                <li>
                  <strong>Safety:</strong> Sanitized cabs, verified drivers, and
                  real-time monitoring.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Companies like IT startups in <strong>Madhapur</strong> and global
                MNCs in <strong>Gachibowli</strong> rely on WTL because it balances{" "}
                <strong>employee comfort with cost savings</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Monthly Corporate Cab Rental Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Monthly Corporate Cab Rental Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                For businesses seeking predictable costs and continuity, WTL offers{" "}
                <strong>monthly corporate cab rental packages in Hyderabad</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Benefits of Monthly Rentals:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Fixed monthly costs</strong> for easy budgeting.
                  </li>
                  <li>
                    <strong>Dedicated cabs</strong> allocated to your workforce.
                  </li>
                  <li>
                    <strong>Replacement cabs</strong> available 24/7 to avoid
                    disruptions.
                  </li>
                  <li>
                    <strong>Custom rental durations</strong> weekly, monthly,
                    quarterly.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This model is ideal for <strong>IT companies, hospitals, and banks</strong> with
                continuous staff mobility needs.
              </p>
            </div>
          </div>
        </section>

        {/* Employee Transport Solutions Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Employee Transport Solutions Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL provides{" "}
                <strong>tailor-made employee transport solutions in Hyderabad</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Types of Solutions:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Shared cabs</strong> Budget-friendly.
                  </li>
                  <li>
                    <strong>Executive cars</strong> for senior management.
                  </li>
                  <li>
                    <strong>Emergency dispatch</strong> urgent requirements.
                  </li>
                  <li>
                    <strong>Multi-location services</strong> flexible pick-up and
                    drop points.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Stat:</strong> Hyderabad businesses report{" "}
                <strong>25% higher punctuality rates</strong> after implementing
                structured employee commute programs with WTL.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Travel Management Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Corporate Travel Management Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                Beyond daily office cabs, WTL is also a{" "}
                <strong>corporate travel management provider in Hyderabad</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>We handle:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Airport transfers</strong> for executives.
                  </li>
                  <li>
                    <strong>Intercity trips</strong> for meetings & client visits.
                  </li>
                  <li>
                    <strong>Conference & event transportation</strong> for large
                    groups.
                  </li>
                  <li>
                    <strong>Pan-India travel coordination</strong> across our 100+
                    city network.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This makes WTL the go-to partner for companies that need{" "}
                <strong>end-to-end mobility solutions</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Dedicated Cab Service Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Dedicated Cab Service for Employees Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL provides{" "}
                <strong>dedicated cab services for employees in Hyderabad</strong>,
                ideal for companies that want <strong>exclusive cabs</strong> for
                executives or entire teams.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Benefits include:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Comfort and privacy</strong> for staff.
                  </li>
                  <li>
                    <strong>Driver consistency</strong> same trusted driver every
                    day.
                  </li>
                  <li>
                    <strong>Faster commutes</strong> with no detours.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This is popular with{" "}
                <strong>law firms, banks, and mid-to-senior management employees</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Outsourced Employee Transportation Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Outsourced Employee Transportation Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                Hiring drivers and maintaining fleets in-house is expensive. WTL
                offers{" "}
                <strong>outsourced employee transportation in Hyderabad</strong>,
                managing the entire system for companies.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>We handle:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Fleet allocation & scheduling</strong>.
                  </li>
                  <li>
                    <strong>Driver management</strong>.
                  </li>
                  <li>
                    <strong>Route optimization</strong>.
                  </li>
                  <li>
                    <strong>Centralized invoicing</strong>.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This reduces operational costs by{" "}
                <strong>up to 40%</strong> while ensuring a smooth, professional
                experience.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Cab Fleet Service Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Corporate Cab Fleet Service Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL operates one of the largest{" "}
                <strong>corporate cab fleet services in Hyderabad</strong>,
                offering:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Sedans, SUVs, vans, and tempo travelers</strong>.
                </li>
                <li>
                  <strong>GPS-enabled, AC, sanitized vehicles</strong>.
                </li>
                <li>
                  <strong>Fleet monitored 24/7</strong> for punctuality.
                </li>
                <li>
                  <strong>Eco-friendly, fuel-efficient rides</strong>.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Whether you need <strong>10 cars or 200</strong>, WTL’s fleet can
                scale to meet demand.
              </p>
            </div>
          </div>
        </section>

        {/* Business Cab Booking Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Business Cab Booking Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL simplifies commute management with{" "}
                <strong>corporate cab booking in Hyderabad</strong>.
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Bulk booking system</strong> for HR/admin.
                </li>
                <li>
                  <strong>One-click portal access</strong>.
                </li>
                <li>
                  <strong>Flexible travel plans</strong> daily, weekly, monthly.
                </li>
                <li>
                  <strong>Real-time booking support</strong>.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This helps companies cut down{" "}
                <strong>administrative overhead</strong> while ensuring smooth
                travel operations.
              </p>
            </div>
          </div>
        </section>

        {/* Long-term Corporate Cab Contract Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Long-term Corporate Cab Contract Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL offers{" "}
                <strong>long-term corporate cab contracts in Hyderabad</strong>{" "}
                that ensure stability and guaranteed service.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Advantages:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Fixed annual rates</strong>.
                  </li>
                  <li>
                    <strong>Dedicated account manager</strong>.
                  </li>
                  <li>
                    <strong>Priority fleet allocation</strong>.
                  </li>
                  <li>
                    <strong>Monthly performance reports</strong>.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This model is preferred by{" "}
                <strong>IT parks, government offices, and large corporations</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* IT Company Cab Service Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              IT Company Cab Service Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                Hyderabad’s IT sector demands round-the-clock mobility. WTL
                specializes in{" "}
                <strong>IT company cab services in Hyderabad</strong>, with
                features like:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>
                  <strong>Night-shift drops & early morning pick-ups</strong>.
                </li>
                <li>
                  <strong>Female employee safety protocols</strong>.
                </li>
                <li>
                  <strong>Multi-shift scheduling support</strong>.
                </li>
                <li>
                  <strong>Real-time employee tracking</strong>.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Client Example:</strong> An IT company in HITEC City
                improved staff punctuality by <strong>42%</strong> after adopting
                WTL’s IT shuttle service.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Taxi with Invoice Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Corporate Taxi with Invoice Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL provides corporate taxis with invoice in Hyderabad, helping
                businesses with compliance and transparent accounting.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Features:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Easy monthly billing</strong>.
                  </li>
                  <li>
                    <strong>GST-compliant invoices</strong>.
                  </li>
                  <li>
                    <strong>Consolidated reports</strong> for finance teams.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                No hidden charges only{" "}
                <strong>clear, professional billing</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Staff Pickup and Drop Cab Provider Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Staff Pickup and Drop Cab Provider Hyderabad
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                WTL is a{" "}
                <strong>trusted staff pickup and drop cab provider in Hyderabad</strong>,
                covering areas like{" "}
                <strong>Banjara Hills, HITEC City, Gachibowli, and Secunderabad</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>Employees benefit from:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Door-to-door service</strong>.
                  </li>
                  <li>
                    <strong>Multi-location routes</strong>.
                  </li>
                  <li>
                    <strong>Comfortable AC rides</strong>.
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                This has improved{" "}
                <strong>employee satisfaction and retention rates</strong> for
                many of our clients.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose WTL Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose WTL for Corporate Cab Service in Hyderabad?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl p-6 shadow-lg">
                <div className="text-blue-700 mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Affordable Pricing
                </h4>
                <p className="text-gray-600">Transparent, no hidden costs.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-200 rounded-xl p-6 shadow-lg">
                <div className="text-green-700 mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Safety First
                </h4>
                <p className="text-gray-600">
                  Sanitized vehicles, GPS monitoring.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-200 rounded-xl p-6 shadow-lg">
                <div className="text-purple-700 mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Pan-Hyderabad Coverage
                </h4>
                <p className="text-gray-600">From HITEC City to Secunderabad.</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-200 rounded-xl p-6 shadow-lg">
                <div className="text-red-700 mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4 2 2 0 002 2m10 0h2a2 2 0 002-2v-3a2 2 0 110-4 2 2 0 00-2-2h-2m-5 0a9 9 0 100 18 9 9 0 000-18zm0 0a9 9 0 019 9"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-time Tracking
                </h4>
                <p className="text-gray-600">
                  Peace of mind for employees & HR.
                </p>
              </div>

              <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-center gap-8">
                <div className="bg-gradient-to-br from-orange-50 to-orange-200 rounded-xl p-6 shadow-lg max-w-sm">
                  <div className="text-orange-700 mb-4">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    500+ Registered Cabs
                  </h4>
                  <p className="text-gray-600">
                    Scalable for companies of all sizes.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-200 rounded-xl p-6 shadow-lg max-w-sm">
                  <div className="text-teal-700 mb-4">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Flexible Packages
                  </h4>
                  <p className="text-gray-600">Weekly, monthly, long-term.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Case Study A Hyderabad IT Success Story
            </h4>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 leading-relaxed mb-6">
                In <strong>2023</strong>, a leading IT firm in{" "}
                <strong>Gachibowli</strong> faced challenges managing employee
                commute for{" "}
                <strong>1,200 staff members across multiple shifts</strong>.
              </p>
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>WTL implemented:</strong>
                </p>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Shuttle-based shared cabs</strong> for clusters.
                  </li>
                  <li>
                    <strong>Dedicated executive cars</strong> for managers.
                  </li>
                  <li>
                    <strong>Automated invoicing system</strong>.
                  </li>
                </ul>
              </div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                Results in 6 months:
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    35% reduction in commute costs.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    45% improvement in punctuality.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-2 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Enhanced employee satisfaction with reliable transport.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h4 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h4>
            <div className="max-w-4xl mx-auto space-y-4">
              <FaqItem
                question="What types of vehicles does WTL offer for corporate cab services?"
                answer="WTL provides a range of vehicles including sedans, SUVs, vans, and tempo travelers, all equipped with AC and GPS for comfort and safety."
              />
              <FaqItem
                question="How does WTL ensure employee safety during commutes?"
                answer="We use GPS tracking, verified drivers, sanitized vehicles, and special safety protocols for late-night drops, especially for women employees."
              />
              <FaqItem
                question="Can WTL handle transportation for large corporate events?"
                answer="Yes, WTL offers conference and event transportation, including airport transfers and intercity trips, with scalable fleets for large groups."
              />
              <FaqItem
                question="What are the benefits of monthly corporate cab rentals?"
                answer="Monthly rentals offer fixed costs, dedicated cabs, 24/7 replacement vehicles, and custom durations for predictable budgeting."
              />
              <FaqItem
                question="How does WTL support eco-friendly transportation?"
                answer="WTL uses fuel-efficient vehicles and optimized routes to reduce carbon emissions, aligning with corporate CSR goals."
              />
            </div>
          </div>
        </section>

          {/* Contact Section */}
          <section className="py-20 w-full bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <h4 className="text-4xl md:text-5xl font-bold mb-6"> Call to Action</h4>
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Contact <strong>WTL Tourism Pvt Ltd</strong> today to explore <strong>customized corporate cab packages</strong> and experience why we are among the most trusted names in employee transportation in India.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <a href="tel:+919130030053" className="group">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📞</div>
                    <h4 className="text-2xl font-semibold mb-2">Phone</h4>
                    <p className="text-lg text-white/90">+91 9130030053</p>
                    <div className="mt-4 text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                      Click to call us directly
                    </div>
                  </div>
                </a>
                
                <a href="mailto:contact@worldtriplink.com" className="group">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📧</div>
                    <h4 className="text-2xl font-semibold mb-2">Email</h4>
                    <p className="text-lg text-white/90">contact@worldtriplink.com</p>
                    <div className="mt-4 text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                      Click to send us an email
                    </div>
                  </div>
                </a>
                
                <div className="group">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📍</div>
                    <h4 className="text-2xl font-semibold mb-2">Address</h4>
                    <p className="text-lg text-white/90">Kharadi, Pune</p>
                    <div className="mt-4 text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                      Visit our office
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-md mx-auto">
                  <a
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px]"
                  >
                    Book Now
                  </a>

                  <button
                    onClick={handleInquiryClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-blue-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer min-w-[140px]"
                  >
                    Enquiry Now
                  </button>
                </div>
              </div>
            </div>
          </section>

          <Footer />
          <FloatingIcons />
          <InquiryPopup
            serviceName="Corporate Cab Service in Hyderabad"
            serviceSlug="Corporate-Cab-Service-Hyderabad"
          />
          <InquiryForm
            isOpen={isInquiryFormOpen}
            onClose={handleInquiryClose}
            serviceName="Corporate Cab Service in Hyderabad"
            serviceSlug="Corporate-Cab-Service-Hyderabad"
          />
        </main>
      </div>
    );
  }