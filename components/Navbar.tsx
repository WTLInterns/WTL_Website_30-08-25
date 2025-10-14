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
      setActiveTab(tabId)
      if (onTabChange) {
        onTabChange(tabId)
      }
    } else {
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

  const ComingSoonModal = () => {
    if (!showComingSoon) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowComingSoon(false)}
        />
        <div className="relative w-full max-w-lg transform transition-all duration-300 ease-out">
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl">🚀</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Coming Soon!
                </h2>
                <p className="text-xl text-gray-700 font-medium">
                  {comingSoonService} Booking
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Got it! I'll wait 🎉
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-transparent shadow-none rounded-none overflow-visible">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-center py-6">
            <div className="inline-flex items-center gap-1 rounded-2xl bg-white/30 text-gray-800 backdrop-blur-md px-3 py-3 shadow-lg border border-white/30">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative rounded-full px-5 py-3 ml-2 text-lg font-bold transition-all duration-200 whitespace-nowrap ${
                    activeTab === item.id && item.id === 'cabs'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-800 hover:text-gray-900 bg-white/20 backdrop-blur-sm'
                  }`}
                  title={item.label}
                >
                  <span className="mr-1">{item.icon}</span>
                  <span>{item.label}</span>
                 
                </button>
              ))}
            </div>

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
              <div className="px-2 w-full flex justify-center">
                <div className="inline-flex items-center gap-1 rounded-full bg-white/30 text-gray-800 backdrop-blur px-2 py-2 shadow-md border border-white/30">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`relative rounded-full px-4 py-2 text-lg font-bold transition-all duration-200 whitespace-nowrap ${
                        activeTab === item.id && item.id === 'cabs'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-800 hover:text-gray-900 bg-white/20 backdrop-blur-sm'
                      }`}
                      title={item.label}
                    >
                      <span className="mr-1">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.id !== 'cabs' && (
                        <span className="ml-1 align-middle text-[9px] font-bold text-gray-600">Soon</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderActiveComponent()}
      <ComingSoonModal />
      {isCorporatePage && (
        <InquiryForm
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          serviceName={corporateServiceName}
          serviceSlug={corporateSlug}
        />
      )}

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
