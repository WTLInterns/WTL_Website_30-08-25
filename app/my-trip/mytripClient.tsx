"use client";

import React, { useState, useEffect } from 'react';
import Navbar2 from '@/components/Navbar2';
import Footer from '@/components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { FaCar, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaRupeeSign } from 'react-icons/fa';

interface TripData {
  id: number;
  fromLocation: string;
  toLocation: string;
  tripType: string;
  startDate: string;
  returnDate: string | null;
  time: string;
  distance: string;
  userId: string;
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  userPickup: string;
  userDrop: string;
  date: string;
  userTripType: string;
  bookid: string;
  car: string;
  baseAmount: number | null;
  amount: number;
  status: number;
  driverBhata: string;
  nightCharges: number;
  gst: number;
  serviceCharge: number;
  offer: string | null;
  offerPartial: number;
  offerAmount: number | null;
  txnId: string;
  payment: string | null;
  dateEnd: string | null;
  timeEnd: string | null;
  bookingType: string;
  description: string | null;
  carrier: string | null;
  penalty: string | null;
  carRentalUser: {
    id: number;
    username: string;
    lastName: string | null;
    email: string;
    phone: string;
    gender: string | null;
    latitude: number;
    longitude: number;
    address: string | null;
    role: string;
  };
}

export default function MyTripPage() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Check if user is logged in using localStorage only
        const lsUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        let blobUserId: string | null = null;
        try {
          const lsUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          const parsed = lsUser ? JSON.parse(lsUser) : null;
          blobUserId = parsed?.userId
            ? String(parsed.userId)
            : (parsed?.id
              ? String(parsed.id)
              : (parsed?.user?.id ? String(parsed.user.id) : null));
        } catch (_) {
          blobUserId = null;
        }

        const id = lsUserId || blobUserId;
        
        // Set login status
        setIsLoggedIn(!!id);
        
        if (!id) {
          setError(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`https://api.worldtriplink.com/api/bookings/by-user/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch trips: ${response.status} ${response.statusText}`);
        }

        // Check if response has content before parsing
        const text = await response.text();
        if (!text) {
          setTrips([]);
          setLoading(false);
          return;
        }

        // Try to parse JSON
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error('Invalid response format from server. Please try again later.');
        }

        setTrips(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching trips. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const getStatusBadgeColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-green-100 text-green-800';
      case 4: return 'bg-red-100 text-red-800';
      case 5: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Confirmed';
      case 3: return 'Completed';
      case 4: return 'Cancelled';
      case 5: return 'In Progress';
      default: return 'Unknown';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar2 />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-12 w-12 border-b-2 border-blue-500 rounded-full"
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Show login/signup buttons if user is not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar2 />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In to View Your Trips</h2>
            <p className="text-gray-600 mb-8">You need to be logged in to access your booking history.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </motion.button>
              </Link>
              
              <Link href="/Register" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar2 />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xl"
          >
            {error}
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar2 />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="text-5xl mb-4">🚗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 mb-8">You haven't made any bookings yet. Start your journey by booking a cab!</p>
            
            <Link href="/" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Book a Cab Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar2 />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            My Trips
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            View and manage your booking history
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold text-blue-600 mb-1"
                    >
                      Booking ID: {trip.bookingId}
                    </motion.div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaCalendarAlt className="mr-2" />
                      {trip.date}
                      <FaClock className="ml-4 mr-2" />
                      {trip.time}
                    </div>
                  </div>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(trip.status)}`}
                  >
                    {getStatusText(trip.status)}
                  </motion.span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-red-500 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">From: {trip.userPickup}</div>
                      <div className="text-sm font-medium text-gray-900">To: {trip.userDrop}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCar className="text-blue-500 mr-3" />
                    <div className="text-sm text-gray-600">
                      <div>Car: {trip.car}</div>
                      <div>Distance: {trip.distance} km</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaUser className="text-green-500 mr-3" />
                    <div className="text-sm text-gray-600">
                      <div>{trip.name}</div>
                      <div>{trip.email}</div>
                      <div>{trip.phone}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaRupeeSign className="text-gray-600 mr-1" />
                        <span className="text-lg font-bold text-gray-900">{trip.amount}</span>
                      </div>
                      {trip.offerAmount && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-green-600 font-medium"
                        >
                          Discount: ₹{trip.offerAmount}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileHover={{ height: "auto", opacity: 1 }}
                className="bg-gray-50 p-4"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Base Amount</div>
                    <div className="font-medium">₹{trip.baseAmount || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Night Charges</div>
                    <div className="font-medium">₹{trip.nightCharges}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">GST</div>
                    <div className="font-medium">₹{trip.gst}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Service Charge</div>
                    <div className="font-medium">₹{trip.serviceCharge}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}