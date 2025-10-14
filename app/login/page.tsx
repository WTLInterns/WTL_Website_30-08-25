"use client"

import React, { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Cookies from "js-cookie"
import Navbar2 from "@/components/Navbar2"
import FloatingIcons from "@/components/FloatingIcons"

export default function LoginPage() {
  const router = useRouter()
  const [mobileNo, setMobileNo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // If redirected after successful registration
    if (typeof window !== "undefined") {
      const hasSuccess = localStorage.getItem("registrationSuccess") === "true"
      const msg = localStorage.getItem("registrationMessage") || "Account created successfully! Please log in."
      if (hasSuccess) {
        setSuccessMessage(msg)
        setShowSuccessMessage(true)
        localStorage.removeItem("registrationSuccess")
        localStorage.removeItem("registrationMessage")
      }
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!mobileNo || !password) {
      setError("Please enter phone number and password")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("https://api.worldtriplink.com/auth/login1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Backend expects 'mobile' not 'mobileNo'
        body: JSON.stringify({ mobile: mobileNo, password }),
      })

      let data: any
      try {
        data = await response.json()
      } catch (err) {
        data = { message: "Unable to parse server response" }
      }

      if (!response.ok) {
        const statusText = response.status === 500
          ? "Server error at the moment. Please try again in a minute."
          : "Please check your credentials and try again."
        setError(data?.message || `Login failed (${response.status}). ${statusText}`)
        return
      }

      // Build user object for app usage
      const userId = data?.userId || data?.user?.id || data?.user?.userId || data?.id
      const user = {
        userId: userId ?? null,
        username: data?.username || data?.user?.username || mobileNo,
        email: data?.email || data?.user?.email || "",
        mobileNo,
        role: (data?.role || data?.user?.role || "USER").toUpperCase(),
        address: data?.address || data?.user?.address || "",
        token: data?.token || data?.accessToken || "",
        isLoggedIn: true,
      }

      // Persist to cookie used by other components (e.g., CabBookingForm)
      Cookies.set("user", JSON.stringify(user), { expires: 7 })
      if (userId) {
        Cookies.set("userId", String(userId), { expires: 7 })
      }

      // Mirror to localStorage for UI features
      localStorage.setItem("user", JSON.stringify(user))
      if (userId) {
        localStorage.setItem("userId", String(userId))
      }

      router.push("/")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background video and overlay */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/video%20(1).mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-violet-900/70" />

      <div className="relative z-10">
        <Navbar2 />
      </div>

      {/* Success toast after registration */}
      {showSuccessMessage && (
        <div className="fixed top-4 m right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 mt-4 sm:mt-8 lg:mt-10 container mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left promo panel */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/80 to-purple-700/80" />
            <div className="relative h-full p-6 sm:p-8 flex flex-col justify-center items-center text-white">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-3 text-center">Welcome Back</h3>
              <p className="text-white/80 text-center max-w-sm text-sm sm:text-base">
                Sign in to book cabs, manage your trips, and enjoy exclusive offers.
              </p>
            </div>
          </div>

          {/* Right form panel */}
          <div className="bg-white p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-start gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6">
              <span className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 text-sm sm:text-base">Login</span>
              <Link href="/Register" className="text-gray-500 hover:text-indigo-600 hover:border-indigo-600 pb-1 border-b-2 border-transparent text-sm sm:text-base">Register</Link>
              <button onClick={() => router.push('/')} className="ml-auto text-gray-400 hover:text-gray-600 text-lg sm:text-xl" aria-label="Close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Login with Phone Number</label>
                <input
                  type="tel"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  placeholder="Enter your 10-digit number"
                  pattern="\d{10}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-medium py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Sign in'}
              </button>
              <div className="text-sm text-gray-600 text-center">
                <Link href="/forgot-password" className="hover:text-indigo-600">Forgot password?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <FloatingIcons />
    </main>
  )
}
