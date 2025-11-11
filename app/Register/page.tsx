'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar2 from '../../components/Navbar2';
import FloatingIcons from '@/components/FloatingIcons';

// SVG Icons
const UserIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface FormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  address: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  role?: string;
  general?: string;
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    address: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  // Handle Google OAuth callback
  useEffect(() => {
    const googleAuth = searchParams.get('googleAuth');
    if (googleAuth === 'success') {
      const userId = searchParams.get('userId');
      const username = searchParams.get('username');
      const email = searchParams.get('email');
      const phone = searchParams.get('phone');
      const role = searchParams.get('role');

      const user = {
        userId: userId || null,
        username: username || email?.split('@')[0] || '',
        email: email || '',
        mobileNo: phone || '',
        role: role || 'USER',
        address: '',
        isLoggedIn: true,
      };

      // Store in localStorage only
      localStorage.setItem('user', JSON.stringify(user));
      if (userId) {
        localStorage.setItem('userId', String(userId));
      }

      setSuccessMessage('Successfully registered with Google!');
      setShowSuccessMessage(true);
      setTimeout(() => router.push('/'), 1500);
    } else if (googleAuth === 'error') {
      const message = searchParams.get('message');
      setErrors({ general: message || 'Google authentication failed' });
    }
  }, [searchParams, router]);

  // Validate password strength
  const validatePasswordStrength = (password: string) => {
    let score = 0;
    let message = '';

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        message = 'Very Weak';
        break;
      case 2:
        message = 'Weak';
        break;
      case 3:
        message = 'Medium';
        break;
      case 4:
        message = 'Strong';
        break;
      case 5:
        message = 'Very Strong';
        break;
    }

    setPasswordStrength({ score, message });
    return score >= 3;
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Address validation
    if (formData.address.length < 5) {
      newErrors.address = 'Please enter a valid address (at least 5 characters)';
    }

    // Role validation
    if (!formData.role || formData.role === '') {
      newErrors.role = 'Please select a role';
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!validatePasswordStrength(formData.password)) {
      newErrors.password = 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'https://api.worldtriplink.com/auth/google/login';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // API call to register user
      const response = await fetch('https://api.worldtriplink.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          mobile: formData.phone,
          password: formData.password,
          role: formData.role,
          address: formData.address
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // On successful registration, store success message in localStorage
      // and redirect to login page
      localStorage.setItem('registrationSuccess', 'true');
      localStorage.setItem('registrationMessage', 'Account created successfully! Please log in.');
      
      // Redirect to login page
      router.push('/login');
    } catch (error: any) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/video%20(1).mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-purple-900/60 to-violet-900/70" />
      
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left promo panel */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/80 to-purple-700/80" />
            <div className="relative h-full p-8 flex flex-col justify-center items-center">
              {/* User Login Illustration */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  {/* User Avatar Circle */}
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  {/* Login Arrow */}
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  {/* Success Checkmark */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Welcome Message */}
              <div className="w-full border border-white/30 rounded-2xl p-6 text-white/90 text-center">
                <p className="text-sm mb-2">Signup to join the club of</p>
                <h3 className="text-3xl font-extrabold leading-tight mb-3">1 Lakh+ Happy Customer</h3>
                <div className="flex items-center justify-center space-x-2 text-sm text-white/70">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Secure Registration</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right form panel */}
          <div className="bg-white p-6 sm:p-8">
            {/* Tabs */}
            <div className="flex items-center justify-start gap-8 mb-6">
              <Link href="/login" className="text-gray-500 hover:text-indigo-600 hover:border-indigo-600 pb-1 border-b-2 border-transparent">Login</Link>
              <span className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">Register</span>
              <button onClick={() => router.push('/')} className="ml-auto text-gray-400 hover:text-gray-600" aria-label="Close">✕</button>
            </div>
            
            {/* Role toggle (UI only) */}
            <div className="flex items-center gap-3 mb-6">
              <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-600" /> As User
              </button>
              {/* <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400" /> As Travel Agent
              </button> */}
            </div>
            
            {errors.general && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-2">
                <p className="flex items-center text-sm">
                  <XIcon />
                  {errors.general}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Username Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.username ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter username"
                    />
                    {formData.username && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {errors.username ? (
                          <XIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>
                
                {/* Email Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter email"
                    />
                    {formData.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {errors.email ? (
                          <XIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Phone Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter phone number"
                    />
                    {formData.phone && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {errors.phone ? (
                          <XIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
                
                {/* Password Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-2.5 border ${
                        errors.password ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOffIcon />
                      ) : (
                        <EyeIcon />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.password}
                    </p>
                  )}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score <= 1 ? 'bg-red-500' :
                              passwordStrength.score === 2 ? 'bg-yellow-500' :
                              passwordStrength.score === 3 ? 'bg-blue-500' :
                              passwordStrength.score === 4 ? 'bg-green-500' :
                              'bg-green-400'
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`ml-2 text-sm ${
                          passwordStrength.score <= 1 ? 'text-red-400' :
                          passwordStrength.score === 2 ? 'text-yellow-400' :
                          passwordStrength.score === 3 ? 'text-blue-400' :
                          'text-green-400'
                        }`}>
                          {passwordStrength.message}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Confirm password"
                    />
                    {formData.confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {errors.confirmPassword ? (
                          <XIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                
                {/* Address Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.address ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter address"
                    />
                    {formData.address && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {errors.address ? (
                          <XIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.address}
                    </p>
                  )}
                </div>
                
                {/* Role Field */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.role ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg bg-black/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200`}
                    >
                      <option value="">Select Role</option>
                      <option value="user">User</option>
                      <option value="travel_agent">Travel Agent</option>
                    </select>
                    {formData.role && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {errors.role ? (
                          <XIcon />
                        ) : (
                          <CheckIcon />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.role}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                  } transition-all duration-200 shadow-lg hover:shadow-pink-500/25`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4 col-span-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  className="col-span-2 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600 rounded-lg bg-white hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}