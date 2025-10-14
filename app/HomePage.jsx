"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import CabBookingForm from "@/components/CabBookingForm";
import BusBookingForm from "@/components/BusBookingForm";
import HotelBookingForm from "@/components/HotelBookingForm";
import FlightBookingForm from "@/components/FlightBookingForm";
import HolidayBookingForm from "@/components/HolidayBookingForm";
import HomestaysBookingForm from "@/components/HomestaysBookingForm";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/destination-card";
import CabCard from "@/components/cab-card";
import AppPromotion from "@/components/app-promotion";
import OnlineCabBookingContent from "@/components/OnlineCabBookingContent";
import Footer from "@/components/footer";
import Navbar2 from "@/components/Navbar2";
import FloatingIcons from "@/components/FloatingIcons";
import MarqueeText from "@/components/MarqueeText";
import InquiryPopup from "../components/InquiryPopup";

export default function HomePage() {
  // Handler to navigate to home page
  const handleImageClick = () => {
    window.location.href = "/";
  };
  const [mounted, setMounted] = useState(false)
  const [currentTab, setCurrentTab] = useState("cabs")
  const [bgImage, setBgImage] = useState("/images/heroo.jpg")

  useEffect(() => setMounted(true), [])

  const handleTabChange = useCallback((tab) => {
    setCurrentTab(tab)
    switch (tab) {
      case "flights":
        setBgImage("/images/flight.jpg")
        break
      case "hotels":
        setBgImage("/images/hotel.jpg")
        break
      case "buses":
        setBgImage("/images/bus.jpg")
        break
      case "cabs":
        setBgImage("/images/heroo.jpg")
        break
      case "homestays":
        setBgImage("/images/villa.jpg")
        break
      case "holiday":
        setBgImage("/images/holiday.jpg")
        break
      default:
        setBgImage("/background.jpg")
    }
  }, [])

  const renderBookingForm = useCallback(() => {
    if (!mounted) return null
    switch (currentTab) {
      case "cabs":
        return <CabBookingForm />
      case "buses":
        return <BusBookingForm />
      case "flights":
        return <FlightBookingForm />
      case "hotels":
        return <HotelBookingForm />
      case "homestays":
        return <HomestaysBookingForm />
      case "holiday":
        return <HolidayBookingForm />
      default:
        return <CabBookingForm />
    }
  }, [currentTab, mounted])

  if (!mounted) return null

  return (
    <main className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden">
        {currentTab === "cabs" ? (
          <>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/images/video%20(1).mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <>
            <Image
              src={bgImage}
              alt="Background"
              fill
              style={{ objectFit: "cover" }}
              priority
              quality={75}
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        )}
      </div>

      <div className="relative">
        <section className="min-h-screen">
          <div className="relative z-10 pt-0">
            <Navbar2 />
            {/* Spacer to offset fixed navbar height */}
            <div className="h-16" aria-hidden="true" />

            <div className="mt-4">
              <MarqueeText />
            </div>

            <div className="mt-0 px-4">
              <Navbar onTabChange={handleTabChange} />
            </div>

            <div className="pt-20 px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto">
              {renderBookingForm()}
            </div>
          </div>
        </section>

        {/* InquiryPopup at top of HomePage */}
        <InquiryPopup serviceName="Home Page Inquiry" serviceSlug="home-page-inquiry" />
   
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50">
          <div className="relative container mx-auto px-2 sm:px-4 lg:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">
              Top Visited Places
            </h2>
            <p className="text-gray-700 text-center mb-8 sm:mb-10 max-w-3xl mx-auto text-sm sm:text-base">
              Discover the most popular destinations in Maharashtra, each offering unique experiences and unforgettable memories.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Row 1 */}
      {/* Row 1 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Delhi"
          tag="Delhi"
          description="Capital city with rich history and heritage"
          rating={5}
          reviews={9500}
          imageSrc="/images/delhi.jpg"
          href="/corporate/Corporate-Employee-Transport-Services-Delhi"
          subDestinations={["Agra", "Mathura", "Rishikesh"]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Mumbai"
          tag="Mumbai"
          description="The city that never sleeps, financial capital of India"
          rating={5}
          reviews={12385}
          imageSrc="/images/mumbai.jpg"
          href="/cities/Cab-Service-Mumbai"
          subDestinations={["Hyderabad", "Bangalore", "Pune"]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Bangalore"
          tag="Bangalore"
          description="Green parks enhance Bangalore's urban charm"
          rating={4}
          reviews={2789}
          imageSrc="/images/banglore.jpg"
          href="/corporate/Monthly-Cab-Service-Bangalore"
          subDestinations={["Mysore", "Hampi", "Coorg"]}
        />
      </div>

      {/* Row 2 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Kolkata"
          tag="Kolkata"
          description="Cultural hub with colonial architecture"
          rating={4}
          reviews={5400}
          imageSrc="/images/kolkata.jpeg"
          href="/corporate/Corporate-Cab-Services-Kolkata"
          subDestinations={["Ranchi", "Digha", "Puri"]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Ahmedabad"
          tag="Ahmedabad"
          description="Vibrant city known for textiles and heritage"
          rating={4}
          reviews={5100}
          imageSrc="/images/Ahmedabad.png"
          href="/corporate/Corporate-Cab-Services-Ahmedabad"
          subDestinations={["Surat", "Mumbai", "Rajkot"]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Pune"
          tag="Pune"
          description="Cultural capital with perfect blend of tradition and modernity"
          rating={5}
          reviews={7064}
          imageSrc="/images/pune.jpg"
          href="/corporate/Corporate-Cab-Service-Pune"
          subDestinations={["Mumbai", "Goa", "Hampi"]}
        />
      </div>

      {/* Row 3 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Chennai"
          tag="Chennai"
          description="Gateway to South India's heritage and beaches"
          rating={4}
          reviews={6200}
          imageSrc="/images/chennai.jpg"
          href="/corporate/Corporate-Cab-Services-Chennai"
          subDestinations={["Tirupati", "Madurai", "Puducherry"]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Hyderabad"
          tag="Hyderabad"
          description="Historic landmarks and thriving tech hubs."
          rating={5}
          reviews={3456}
          imageSrc="/images/hyderabad.jpg"
          href="/corporate/Corporate-Cab-Services-Hyderabad"
          subDestinations={["Bangalore", "Guntur", "Vijayawada"]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
        <DestinationCard
          city="Nagpur"
          tag="Nagpur"
          description="Beaches, forts and vibrant nightlife"
          rating={5}
          reviews={8400}
          imageSrc="/images/Nagpur.jpeg"
          href="/corporate/Corporate-Cab-Services-Nagpur"
          subDestinations={["Pune", "Mumbai", "Hampi"]}
        />
      </div>
    </div>
  </div>
</section>

        {currentTab === "cabs" && (
  <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50">
    <div className="container mx-auto px-2 sm:px-4 lg:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">
        Book Your Cab Now!
      </h2>
      <p className="text-gray-700 text-center mb-8 sm:mb-10 max-w-3xl mx-auto text-sm sm:text-base">
        Choose from our selection of comfortable and reliable vehicles
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
          <CabCard
            type="Luxury"
            description="Premium comfort and style"
            imageSrc="/images/luxury-car.jpg"
            onImageClick={handleImageClick}
          />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
          <CabCard
            type="Hatchback"
            description="Compact and efficient"
            imageSrc="/images/glanza.jpg"
            onImageClick={handleImageClick}
          />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition">
          <CabCard
            type="Sedan"
            description="Perfect balance of comfort"
            imageSrc="/images/aura.jpg"
            onImageClick={handleImageClick}
          />
        </div>
      </div>
    </div>
        </section>
        )}

        <OnlineCabBookingContent />
        <AppPromotion />
        <Footer />
        <FloatingIcons />
      </div>
    </main>
  )
}
