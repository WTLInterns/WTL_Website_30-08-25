"use client";

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaSpinner, FaCheckCircle, FaTimes, FaThumbsUp } from 'react-icons/fa';
import Navbar2 from '@/components/Navbar2';
import FloatingIcons from '@/components/FloatingIcons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Enhanced Amazon-style success sound with higher volume
  const playAmazonStyleSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create multiple oscillators for richer sound
      const createTone = (frequency, startTime, duration, volume = 0.4) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        // Enhanced volume envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        
        return { oscillator, gainNode };
      };

      // Amazon-style "cha-ching" success sound progression
      const currentTime = audioContext.currentTime;
      
      // First chord - Major triad (C-E-G)
      createTone(523.25, currentTime, 0.3, 0.5); // C5
      createTone(659.25, currentTime, 0.3, 0.4); // E5
      createTone(783.99, currentTime, 0.3, 0.3); // G5
      
      // Second chord - Higher octave for "ching" effect
      createTone(1046.5, currentTime + 0.15, 0.4, 0.6); // C6
      createTone(1318.5, currentTime + 0.15, 0.4, 0.5); // E6
      createTone(1567.98, currentTime + 0.15, 0.4, 0.4); // G6
      
      // Add subtle reverb effect
      const convolver = audioContext.createConvolver();
      const impulseResponse = audioContext.createBuffer(2, audioContext.sampleRate * 0.5, audioContext.sampleRate);
      
      for (let channel = 0; channel < impulseResponse.numberOfChannels; channel++) {
        const channelData = impulseResponse.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channelData.length, 2);
        }
      }
      
      convolver.buffer = impulseResponse;

    } catch (error) {
      console.log('Enhanced audio not supported, using fallback');
      // Fallback to system notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaApjH7+STSSMCFGzx4KhvLQAGcMfk1MV4NQAWR7DyzMR2OQsOV7bPynBAMwkOTq3e1o59Pj0VbbHwuklTPjFFOhktqBW0/XVgD4a5LIiKMCbHUBCm+g+lzzx5FphKlg4iZqbIUg+o+kfKQJBLlmHVQKFMfFKnHQnDkdq3fhqp6iV');
      audio.volume = 0.7;
      audio.play().catch(() => console.log('Fallback audio failed'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('https://api.worldtriplink.com/contacts/create-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact saved:', result);
        
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
        });
        
        // Show professional popup and play Amazon-style sound
        setShowSuccessPopup(true);
        playAmazonStyleSuccessSound();
        
        // Auto-hide popup after 5 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 5000);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: ''
        });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
        {/* Hero Section */}
        <div className="relative h-[40vh] bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl md:text-2xl">We'd love to hear from you</p>
            </div>
          </div>
        </div>

        {/* Professional Amazon-Style Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-500 ease-out animate-slideInUp">
              {/* Header with Brand Colors */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white rounded-full p-2 animate-pulse">
                      <FaCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Message Sent Successfully!</h3>
                  </div>
                  <button
                    onClick={closeSuccessPopup}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
              </div>
              
              {/* Content Body */}
              <div className="px-6 py-8">
                {/* Success Icon Animation */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4 animate-bounce">
                    <FaThumbsUp className="text-2xl text-green-600" />
                  </div>
                  
                  {/* Professional Message */}
                  <div className="space-y-3">
                    <p className="text-gray-800 font-semibold text-lg">
                      Thank you for contacting WTL Tourism!
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Your enquiry has been successfully submitted. Our team will review your message and respond within <strong>24 hours</strong>.
                    </p>
                    
                    {/* Contact Details Confirmation */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-700">
                        <strong>Confirmation sent to:</strong><br />
                        📧 {formData.email}<br />
                        📱 {formData.phone}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={closeSuccessPopup}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Perfect! Close Window
                  </button>
                  
                  <button
                    onClick={() => window.location.href = 'tel:+919730545491'}
                    className="w-full bg-white border-2 border-blue-600 text-blue-600 py-2 px-6 rounded-lg font-medium hover:bg-blue-50 transition-all duration-300"
                  >
                    📞 Call Us Now
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 animate-progressBar"
                  style={{ 
                    animation: 'progressBar 5s linear forwards' 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaMapMarkerAlt className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Our Location</h3>
                      <p className="text-gray-600">Kharadi, Pune, Maharashtra 411014</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaPhone className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Phone Number</h3>
                      <p className="text-gray-600">+91 9730545491</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaEnvelope className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Address</h3>
                      <p className="text-gray-600">info@wtltourism.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaClock className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Working Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              
              {submitStatus.message && !showSuccessPopup && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone No
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        <FloatingIcons />
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes progressBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            transform: translateY(50px) scale(0.9); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
        
        .animate-progressBar {
          width: 100%;
        }
      `}</style>
    </> 
  );
};

export default Contact;
