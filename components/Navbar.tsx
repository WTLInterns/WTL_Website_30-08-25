"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import CabBookingForm from '../components/CabBookingForm'
import BusBookingForm from '../components/BusBookingForm'
import HotelBookingForm from '../components/HotelBookingForm'
import FlightBookingForm from '../components/FlightBookingForm'
import HolidayBookingForm from '../components/HolidayBookingForm'
import HomestaysBookingForm from './HomestaysBookingForm'
import InquiryPopup from './InquiryPopup'
import InquiryForm from './InquiryForm'

interface NavbarProps {
  onTabChange?: (tab: string) => void;
  disableForm?: boolean;
}

export default function Navbar({ onTabChange, disableForm = false }: NavbarProps) {
  const [activeTab, setActiveTab] = useState('cabs')
  const [showForm, setShowForm] = useState(true)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonService, setComingSoonService] = useState('')
  const pathname = usePathname()
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  // Corporate route detection and service name derivation
  const isCorporatePage = pathname?.startsWith('/corporate/') || false
  console.log(isCorporatePage)
  const corporateSlug = isCorporatePage ? pathname.replace('/corporate/', '') : ''
  const deriveServiceName = (slug: string) => {
    if (!slug) return 'Corporate Enquiry'
    const cleaned = slug.replace(/-/g, ' ')
    const parts = slug.split('-')
    if (parts.length <= 1) return cleaned
    const city = parts[parts.length - 1]
    const base = parts.slice(0, -1).join(' ')
    return `${base} in ${city}`
  }
  const corporateServiceName = deriveServiceName(corporateSlug)

  // Check if we're on a page that already has a booking form
  useEffect(() => {
    const pagesWithForms = ['/cities/Cab-Service-Pune', '/', '/cities/Cab-Service-Mumbai', '/cities/Cab-Service-Kolhapur']
    setShowForm(!pagesWithForms.includes(pathname))
  }, [pathname])

  const navItems = [
    { id: 'cabs', label: 'Cabs', icon: '🚕', component: CabBookingForm },
    { id: 'buses', label: 'Buses', icon: '🚌', component: BusBookingForm },
    { id: 'flights', label: 'Flights', icon: '✈️', component: FlightBookingForm },
    { id: 'hotels', label: 'Hotels', icon: '🏨', component: HotelBookingForm },
    { id: 'homestays', label: 'Homestays & Villas', icon: '🏠', component: HomestaysBookingForm },
    { id: 'holiday', label: 'Holiday Packages', icon: '🌴', component: HolidayBookingForm },

  ]

  const handleTabClick = (tabId: string) => {
    if (tabId === 'cabs') {
      // Only cabs is available, others show coming soon
      setActiveTab(tabId)
      if (onTabChange) {
        onTabChange(tabId)
      }
    } else {
      // Show coming soon modal for other services
      const serviceItem = navItems.find(item => item.id === tabId)
      setComingSoonService(serviceItem?.label || '')
      setShowComingSoon(true)  
    }
  }

  const renderActiveComponent = () => {
    if (!showForm || disableForm) return null;
    
    const activeItem = navItems.find(item => item.id === activeTab)
    if (activeItem && activeItem.component) {
      const Component = activeItem.component
      return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-4">
          <Component />
        </div>
      )
    }
    return null
  }

  // Coming Soon Modal Component
  const ComingSoonModal = () => {
    if (!showComingSoon) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
          .float-animation { animation: float 3s ease-in-out infinite; }
          .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .sparkle { animation: sparkle 1.5s ease-in-out infinite; }
        `}</style>

        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowComingSoon(false)}
        />

        {/* Modal */}
        <div className="relative w-full max-w-lg transform transition-all duration-300 ease-out">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl border border-white/20 overflow-hidden pulse-glow">

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full sparkle" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400 rounded-full sparkle" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-green-400 rounded-full sparkle" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-400 rounded-full sparkle" style={{animationDelay: '1.5s'}}></div>

            {/* Close Button */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Animated Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto float-animation shadow-lg">
                  <span className="text-4xl">🚀</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
              </div>

              {/* Main Message */}
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Coming Soon!
                </h2>
                <p className="text-xl text-gray-700 font-medium">
                  {comingSoonService} Booking
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We're working hard to bring you an amazing {comingSoonService.toLowerCase()} booking experience.
                  Stay tuned for something spectacular!
                </p>
              </div>

              {/* Features Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/40">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center">
                  <span className="mr-2">🎯</span>
                  What to Expect
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Best Prices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Easy Booking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">24/7 Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Instant Booking</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Got it! I'll wait 🎉
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowComingSoon(false);
                      setActiveTab('cabs');
                    }}
                    className="flex-1 bg-white text-blue-600 py-2 px-4 rounded-xl font-medium border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300"
                  >
                    Book Cabs Now 🚕
                  </button>
                  <button
                    onClick={() => setShowComingSoon(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    Notify Me 🔔
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Meanwhile, enjoy our cab booking service! 🚗💨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-between overflow-x-auto whitespace-nowrap py-2">
            <Link 
              href="/"
              className="flex items-center justify-center min-w-[40px] h-[40px] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mr-4"
              title="Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center px-4 py-2 space-y-1 min-w-[80px] transition-colors duration-200 ${
                  activeTab === item.id && item.id === 'cabs'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-blue-500'
                } ${item.id !== 'cabs' ? 'relative' : ''}`}
                onClick={() => handleTabClick(item.id)}
              >
                <div className="relative">
                  <span className="text-xl">{item.icon}</span>
                  {item.id !== 'cabs' && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[8px] px-1 py-0.5 rounded-full font-bold shadow-sm">
                      SOON
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}

            {isCorporatePage && (
              <div className="ml-4">
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
                >
                  Enquiry Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto hide-scrollbar pb-2">
              <div className="flex items-center space-x-2 px-2">
                <Link 
                  href="/"
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  title="Home"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`flex flex-col items-center px-3 py-1 min-w-[70px] transition-colors duration-200 ${
                      activeTab === item.id && item.id === 'cabs'
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-600 hover:text-blue-500'
                    } ${item.id !== 'cabs' ? 'relative' : ''}`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <div className="relative">
                      <span className="text-lg mb-0.5">{item.icon}</span>
                      {item.id !== 'cabs' && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[6px] px-1 py-0.5 rounded-full font-bold shadow-sm">
                          SOON
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
                  </button>
                ))}

                {isCorporatePage && (
                  <button
                    onClick={() => setIsInquiryOpen(true)}
                    className="px-4 py-2 text-[10px] font-medium whitespace-nowrap text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  >
                    Enquiry Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {renderActiveComponent()}

      {/* Coming Soon Modal */}
      <ComingSoonModal />

      {/* Corporate enquiry modal */}
      {isCorporatePage && (
        <InquiryForm
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          serviceName={corporateServiceName}
          serviceSlug={corporateSlug}
        />
      )}
    </div>
  )
}
 