"use client"

import React, { useEffect, useState, FormEvent, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Navbar2 from "@/components/Navbar2"
import FloatingIcons from "@/components/FloatingIcons"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileNo, setMobileNo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

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

    // Handle Google OAuth callback
    const googleAuth = searchParams.get('googleAuth')
    if (googleAuth === 'success') {
      const userId = searchParams.get('userId')
      const username = searchParams.get('username')
      const email = searchParams.get('email')
      const phone = searchParams.get('phone')
      const role = searchParams.get('role')

      const user = {
        userId: userId || null,
        username: username || email?.split('@')[0] || '',
        email: email || '',
        mobileNo: phone || '',
        role: role || 'USER',
        address: '',
        isLoggedIn: true,
      }

      // Store in localStorage only
      localStorage.setItem('user', JSON.stringify(user))
      if (userId) {
        localStorage.setItem('userId', String(userId))
      }

      setSuccessMessage('Successfully logged in with Google!')
      setShowSuccessMessage(true)
      setTimeout(() => router.push('/'), 1500)
    } else if (googleAuth === 'error') {
      const message = searchParams.get('message')
      setError(message || 'Google authentication failed')
    }
  }, [searchParams, router])

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'https://api.worldtriplink.com/auth/google/login'
  }

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

      // Store in localStorage only
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

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <FloatingIcons />
    </main>
  )
}

// Export a Suspense-wrapped default page
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
