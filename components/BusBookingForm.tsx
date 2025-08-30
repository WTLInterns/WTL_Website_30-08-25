"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function BusBookingForm() {
  const [tripType, setTripType] = useState("one-way")
  const [vehicleType, setVehicleType] = useState("buses")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  const openDatePicker = (id: string) => {
    const dateInput = document.getElementById(id) as HTMLInputElement
    
    if (dateInput) {
      try {
        if (typeof dateInput.showPicker === "function") {
          dateInput.showPicker()
        }
      } catch (error) {
        console.log("Date picker not supported in this browser")
      }
    }
  }

  const openTimePicker = (id: string) => {
    const timeInput = document.getElementById(id) as HTMLInputElement
    if (timeInput) {
      try {
        if (typeof timeInput.showPicker === "function") {
          timeInput.showPicker()
        }
      } catch (error) {
        console.log("Time picker not supported in this browser")
      }
    }
  }

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <div className="space-y-6">
        {/* Vehicle Type Selection */}
        <div className="flex space-x-4">
        </div>

        {/* Trip Type Selection */}
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={tripType === "one-way"}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white">one Way</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="round-trip"
              checked={tripType === "round-trip"}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white">round Trip</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="rental-trip"
              checked={tripType === "rental-trip"}
              onChange={(e) => setTripType(e.target.value)}
              className="form-radio text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-white">rental Trip</span>
          </label>
        </div>

        {/* Location and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Pickup Location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter pickup location"
                className="w-full p-3 pl-10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/20 text-white placeholder-white/70"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Drop Location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter drop location"
                className="w-full p-3 pl-10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/20 text-white placeholder-white/70"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Pickup Date</label>
            <div className="relative">
              <input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={today}
                className="w-full p-3 pl-10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/20 text-white [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <button
                type="button"
                onClick={() => openDatePicker("pickupDate")}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/70 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {tripType === "round-trip" && (
            <div>
              <label className="block text-sm font-medium text-white mb-1">Return Date</label>
              <div className="relative">
                <input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={pickupDate || today}
                  className="w-full p-3 pl-10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/20 text-white [&::-webkit-calendar-picker-indicator]:opacity-0"
                />
                <button
                  type="button"
                  onClick={() => openDatePicker("returnDate")}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/70 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-1">Pickup Time</label>
            <div className="relative">
              <input
                id="pickupTime"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full p-3 pl-10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/20 text-white opacity-0 absolute inset-0 cursor-pointer"
              />
              <div className="w-full p-3 border border-white/20 rounded-lg bg-white/20 text-white">
                <button
                  type="button"
                  onClick={() => openTimePicker("pickupTime")}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/70 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <span className="pl-10 text-white">
                  {pickupTime ? formatTime(pickupTime) : "Select Time"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-emerald-500 text-white px-12 py-3 rounded-lg text-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Search Available Buses
          </button>
        </div>
      </div>
    </div>
  )
} 