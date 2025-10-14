"use client"

import React from "react"

export default function OnlineCabBookingContent() {
  return (
    <section className="py-16 bg-[#f2f2f2]">
      <div className="mx-auto w-[90%] px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Online Cab Booking on WTL</h2>
        <div className="mx-auto mt-3 h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full" />
        
        {/* Intro paragraphs */}
        <p className="mt-6 text-gray-700 leading-7">
          For most travellers in India, the road is more than a route — it’s an experience. Road trips let you pause for scenic views,
          taste local food, and travel at a pace that suits you. With WTL, booking a comfortable, reliable cab is effortless. Visit our
          website or app, pick a cab, and you’re ready to go — simple, fast and stress-free.
        </p>
        <p className="mt-4 text-gray-700 leading-7">
          Our platform is built for ease: a clean interface, quick menus and smart filters make online cab booking intuitive for everyone.
          Whether you need a short city ride or an intercity car rental for a long journey, WTL’s flexible packages ensure your travel
          plans are covered within minutes.
        </p>

        {/* Steps */}
        <h3 className="mt-10 text-2xl md:text-3xl font-semibold text-center text-gray-900">Book Your Cab Online — Fast, Flexible, Reliable</h3>
        <p className="mt-6 text-gray-700 leading-7">
          Choose WTL for premium fleet options and dependable service. Our platform brings a wide variety of vehicles to your fingertips,
          and you can also search for train, flight or bus options from the same portal. Booking with WTL is straightforward:
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl shadow-sm p-5 border border-slate-100 bg-indigo-50">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">1</span>
              <p className="text-gray-800 font-medium">Sign in to WTL</p>
            </div>
            <p className="mt-2 text-gray-600 text-sm">Create or log in to your account to get started.</p>
          </div>
          <div className="rounded-xl shadow-sm p-5 border border-slate-100 bg-purple-50">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">2</span>
              <p className="text-gray-800 font-medium">Enter trip details</p>
            </div>
            <p className="mt-2 text-gray-600 text-sm">Pickup, destination, date and preferred time.</p>
          </div>
          <div className="rounded-xl shadow-sm p-5 border border-slate-100 bg-pink-50">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">3</span>
              <p className="text-gray-800 font-medium">Search & compare</p>
            </div>
            <p className="mt-2 text-gray-600 text-sm">View cars with clear pricing and features.</p>
          </div>
        </div>

        {/* Road trip */}
        <p className="mt-4 text-gray-700 leading-7">
          You’ll see multiple taxi options with clear pricing and features. Fares vary by vehicle type, onboard amenities, route and travel
          date — helping you pick the best car for your needs and budget.
        </p>

        {/* Why Choose WTL */}
        <h3 className="mt-10 text-2xl md:text-3xl font-semibold text-center text-gray-900">Why Choose WTL?</h3>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-blue-50">
            <h4 className="font-semibold text-gray-900">Simple 3-Step Booking</h4>
            <p className="mt-1 text-gray-700 text-sm">Pick pickup & drop → Choose vehicle → Confirm.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-green-50">
            <h4 className="font-semibold text-gray-900">Transparent Pricing</h4>
            <p className="mt-1 text-gray-700 text-sm">No hidden fees; clear fare breakdowns.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-yellow-50">
            <h4 className="font-semibold text-gray-900">Wide Vehicle Selection</h4>
            <p className="mt-1 text-gray-700 text-sm">Economical sedans to tempo travellers and luxury cars.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-orange-50">
            <h4 className="font-semibold text-gray-900">Dependable & On-time</h4>
            <p className="mt-1 text-gray-700 text-sm">Professional drivers and optimized routes.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-red-50">
            <h4 className="font-semibold text-gray-900">Safety & Security</h4>
            <p className="mt-1 text-gray-700 text-sm">GPS tracking, background checks and training.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-teal-50">
            <h4 className="font-semibold text-gray-900">24/7 Support</h4>
            <p className="mt-1 text-gray-700 text-sm">Help with bookings, cancellations and emergencies.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-pink-50">
            <h4 className="font-semibold text-gray-900">Multiple Payment Options</h4>
            <p className="mt-1 text-gray-700 text-sm">Cards, UPI, netbanking and wallets.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-purple-50">
            <h4 className="font-semibold text-gray-900">Eco-Friendly Options</h4>
            <p className="mt-1 text-gray-700 text-sm">Electric and hybrid vehicles available.</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm border border-slate-100 bg-indigo-50">
            <h4 className="font-semibold text-gray-900">Corporate & Group Solutions</h4>
            <p className="mt-1 text-gray-700 text-sm">Custom quotes, monthly billing, dedicated support.</p>
          </div>
        </div>

        {/* Social Posts */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg p-4 shadow-sm bg-emerald-50">
            <p>“Road trip time! 🚗 Book your outstation cab with WTL — comfortable cars, transparent fares, 24/7 support. Book now!”</p>
          </div>
          <div className="rounded-lg p-4 shadow-sm bg-sky-50">
            <p>“Need a cab in a hurry? WTL gets you there — quick booking, safe drivers, multiple payment options. #TravelEasy”</p>
          </div>
        </div>

        {/* Marathi Snippet */}
        <div className="mt-12 rounded-xl p-5 shadow-sm bg-rose-50">
          <h5 className="font-semibold text-gray-900 mb-2">मराठी (Marathi)</h5>
          <p className="text-gray-700">
            WTL सोबत प्रवास सुरक्षित व सोपा. आमच्या ॲप किंवा वेबसाईटवर थोड्या चरणांत बुक करा — विश्वसनीय ड्रायव्हर, पारदर्शक दर आणि २४/७ समर्थन.
          </p>
        </div>
      </div>
    </section>
  )
}
