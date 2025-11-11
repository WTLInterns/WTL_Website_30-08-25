"use client";

import React, { useState } from "react";
import { X, User, Mail, Phone, Send } from "lucide-react";

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  serviceSlug?: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ isOpen, onClose, serviceName, serviceSlug }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    companyName: "",
    service: serviceSlug || "",
    serviceName: serviceName || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare data according to your backend API structure
    const enquiryData = {
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      companyName: formData.companyName,
      serviceName: formData.serviceName,
      timeStamp: new Date().toISOString()
    };

    // Log the data being sent
    console.log("=".repeat(50));
    console.log("📋 INQUIRY FORM SUBMISSION");
    console.log("=".repeat(50));
    console.log("👤 USER INFORMATION:");
  console.log(`   Name: ${enquiryData.name}`);
  console.log(`   Email: ${enquiryData.email}`);
  console.log(`   Contact: ${enquiryData.contact}`);
  console.log(`   Company Name: ${enquiryData.companyName}`);
  console.log(`   Service Name: ${enquiryData.serviceName}`);
  console.log(`   Timestamp: ${enquiryData.timeStamp}`);
    console.log("=".repeat(50));

    try {
      // Call your backend API
      // You can configure the base URL here or use environment variables
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.worldtriplink.com';
      const response = await fetch(`${API_BASE_URL}/create-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Backend Response:', result);

      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedData(result); // Store the response data for display

      // Auto close after 5 seconds to let users enjoy the success message
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setSubmittedData(null);
        setFormData({
          name: "",
          email: "",
          contact: "",
          companyName: "",
          service: serviceSlug || "",
          serviceName: serviceName || ""
        });
      }, 5000);

    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit enquiry. Please try again.');

      // Clear error after 5 seconds
      setTimeout(() => {
        setSubmitError(null);
      }, 5000);
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .confetti-animation {
          animation: confetti 2s ease-out infinite;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-2">Inquiry Form</h2>
            <p className="text-blue-100 text-sm">{serviceName}</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Contact Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Your Contact Number"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Company Name Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="7" width="18" height="13" rx="2" strokeWidth="2" />
                      <path d="M16 3v4M8 3v4" strokeWidth="2" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Company Name (optional)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>

                {/* Error Message */}
                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="py-8 slide-in-up">
                {/* Animated Success Header */}
                <div className="text-center mb-8">
                  {/* Animated Success Icon */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {/* Celebration particles */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -top-1 -right-3 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute -bottom-2 -left-3 w-5 h-5 bg-pink-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
                    <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1.5s'}}></div>
                  </div>

                  {/* Success Message */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      🎉 Awesome! We Got Your Message!
                    </h3>
                    <p className="text-lg text-gray-700 font-medium">Your inquiry has been submitted successfully!</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Our team will contact you within 24 hours</span>
                    </div>
                  </div>
                </div>


                {/* Beautiful Confirmation Card */}
                {submittedData && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-lg">
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-bold text-green-800 mb-2">📋 Your Enquiry Details</h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
                    </div>

                    <div className="space-y-4">
                      {/* Personal Info Card */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h5 className="font-semibold text-gray-800">Your Information</h5>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-800">{submittedData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-800">{submittedData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contact:</span>
                            <span className="font-medium text-gray-800">{submittedData.contact}</span>
                          </div>
                          {submittedData.companyName && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Company Name:</span>
                              <span className="font-medium text-gray-800">{submittedData.companyName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Info Card */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h5 className="font-semibold text-gray-800">Service Details</h5>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service:</span>
                            <span className="font-medium text-gray-800">{submittedData.serviceName}</span>
                          </div>
                          {submittedData.timeStamp && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Submitted:</span>
                              <span className="font-medium text-gray-800">{new Date(submittedData.timeStamp).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enquiry ID Badge */}
                      {submittedData.id && (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white text-center">
                          <div className="flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Enquiry ID</span>
                          </div>
                          <p className="font-mono text-lg tracking-wider">{submittedData.id}</p>
                          <p className="text-green-100 text-xs mt-1">Save this ID for future reference</p>
                        </div>
                      )}
                    </div>

                    {/* Next Steps */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h6 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        What happens next?
                      </h6>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Our team will review your enquiry</li>
                        <li>• You'll receive a call/email within 24 hours</li>
                        <li>• We'll provide a customized quote for your needs</li>
                      </ul>
                    </div>

                    {/* Thank You Footer */}
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium shadow-lg">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Thank you for choosing WTL Tourism!
                      </div>
                      <p className="text-xs text-gray-500 mt-3">This window will close automatically in a few seconds</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
