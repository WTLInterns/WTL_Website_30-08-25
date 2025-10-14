import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

export default function AppPromotion() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 text-gray-900">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Text content */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              WTL Android and iOS App is Available!
            </h2>
            <p className="text-lg sm:text-xl text-gray-700">
              Travel smarter with our all-in-one mobile solution
            </p>

            {/* Features */}
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Access and change your itinerary on-the-go",
                "Free cancellation on select hotels",
                "Get real-time trip updates",
                "Exclusive mobile-only deals",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                  <span className="bg-emerald-100 text-emerald-700 rounded-full p-1 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <span className="text-gray-800 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mt-4 sm:mt-6">
              <Link
                href="#"
                className="bg-white/80 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 text-gray-900 shadow-sm hover:bg-indigo-50 transition-colors text-sm sm:text-base"
              >
                <Image
                  src="/images/app_store.png"
                  alt="App Store"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="font-medium">App Store</span>
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.yourcompany.worldtriplink&hl=en"
                className="bg-white/80 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 text-gray-900 shadow-sm hover:bg-green-50 transition-colors text-sm sm:text-base"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/images/play_store.jpg"
                  alt="Google Play"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span className="font-medium">Google Play</span>
              </a>
            </div>
          </div>

          {/* App mockup */}
          <div className="flex justify-center mt-6 lg:mt-0">
            <a
              href="https://play.google.com/store/apps/details?id=com.yourcompany.worldtriplink&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open WTL Tourism Car Rental app on Google Play Store"
              style={{ display: "block" }}
            >
              <div className="relative w-48 sm:w-56 md:w-64 h-[380px] sm:h-[450px] md:h-[500px] cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute inset-0 rounded-[30px] sm:rounded-[40px] border-4 sm:border-6 md:border-8 border-black overflow-hidden shadow-xl bg-white">
                  <Image
                    src="/images/app_logo.jpeg"
                    alt="Mobile app screenshot"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-28 md:w-32 h-1 bg-white/70 rounded-full"></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
