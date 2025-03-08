import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { config } from '../config/env';
import { Book, Users } from 'react-feather';

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

function LoginSignUp() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    general: ''
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      general: ''
    };

    // Name validation (only for registration)
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));

    // Clear the specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      name: '',
      email: '',
      password: '',
      general: ''
    });

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      let response;
      if (isLogin) {
        // Login route
        response = await axios.post('/auth/login/student', {
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Registration route
        response = await axios.post('/auth/register/student', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      // Log the full response for debugging
      console.log('Full Response:', response);

      // For registration, if we get a 201 status, redirect to login
      if (!isLogin && response.status === 201) {
        setIsLogin(true); // Switch to login view
        setFormData(prev => ({
          ...prev,
          name: '' // Clear name field
        }));
        // Show success message
        setErrors(prev => ({
          ...prev,
          general: 'Registration successful! Please login with your credentials.'
        }));
        return;
      }

      // Handle login flow
      const token = response.data.access_token;
      if (!token) {
        console.error('No token received from server');
        setErrors(prev => ({
          ...prev,
          general: 'Login failed - please try again'
        }));
        return;
      }

      console.log('Token received:', token);
      console.log('User data:', response.data.user);

      // Store the token
      localStorage.setItem('userToken', token);

      // Store user data with token included
      const userData = {
        ...(isLogin ? response.data.user : response.data),
        token: token,
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };

      // Log the user data being stored
      console.log('Storing user data:', userData);

      localStorage.setItem('user', JSON.stringify(userData));
      
      // Clear any previously selected plan if needed
      localStorage.removeItem('selectedPlan');

      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Also set it for any other axios instances that might be used
      console.log('Setting global Authorization header for all axios instances');

      // Check if there's a redirect URL in sessionStorage
      const redirectUrl = sessionStorage.getItem('redirectUrl');

      // Navigate based on login or registration
      if (isLogin && redirectUrl) {
        // Clear the redirect URL from sessionStorage
        sessionStorage.removeItem('redirectUrl');
        navigate(redirectUrl);
      } else {
        navigate(isLogin ? '/dashboard' : '/onboarding');
      }
    } catch (error: any) {
      console.error(isLogin ? 'Error during login:' : 'Error during registration:', error);
      
      // Check if it's an Axios error with a response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.message || 
                             error.response.data.error || 
                             (isLogin ? 'Login failed' : 'Registration failed');
        setErrors(prev => ({
          ...prev,
          general: errorMessage
        }));
        console.error('Detailed error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setErrors(prev => ({
          ...prev,
          general: 'No response received from server'
        }));
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrors(prev => ({
          ...prev,
          general: 'Error in request setup'
        }));
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-green-300 to-blue-300 overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10"
        animate={{
          rotate: 360,
          y: [0, -10, 0]
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-16 h-16 bg-red-400 rounded-full shadow-lg"></div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-20"
        animate={{
          rotate: -360,
          x: [0, 10, 0]
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          x: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-20 h-20 bg-purple-400 rounded-full shadow-lg"></div>
      </motion.div>

      <motion.div
        className="absolute top-1/4 right-1/4"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-12 h-12 bg-yellow-400 transform rotate-45 shadow-lg"></div>
      </motion.div>

      <div className="flex items-center justify-center relative z-10">
        {/* Login/Signup Card */}
        <motion.div
          className="max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-400"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E')",
            backgroundSize: "cover"
          }}
        >
          {/* Logo or Brand Section */}
          <div className="bg-gradient-to-r from-pink-400 to-purple-500 px-8 py-6 text-white text-center">
            <motion.h2
              className="text-3xl font-bold mb-2 font-comic"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Elimu Global
            </motion.h2>
            <p className="text-pink-100">Learning is Fun!</p>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-purple-600 font-comic">
              {isLogin ? 'Welcome Back, Friend!' : 'Join Our Learning Adventure!'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-purple-500 mb-1 font-comic">What's your name?</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your awesome name"
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-purple-700 bg-purple-50 font-comic"
                      required
                    />
                    {errors.name && <div className="text-red-500 text-sm font-comic">{errors.name}</div>}
                  </div>
                </>
              )}
              <div>
                <label className="block text-purple-500 mb-1 font-comic">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-purple-700 bg-purple-50 font-comic"
                  required
                />
                {errors.email && <div className="text-red-500 text-sm font-comic">{errors.email}</div>}
              </div>
              <div className="relative">
                <label className="block text-purple-500 mb-1 font-comic">Secret Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Your secret code"
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-purple-700 bg-purple-50 pr-16 font-comic"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/4 text-purple-500 hover:text-purple-700 transition-colors font-comic"
                >
                  {showPassword ? '🙈 Hide' : '👀 Show'}
                </button>
                {errors.password && <div className="text-red-500 text-sm mt-1 font-comic">{errors.password}</div>}
              </div>
              {errors.general && <div className="text-red-500 text-sm font-comic">{errors.general}</div>}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 px-6 rounded-xl font-bold hover:from-green-500 hover:to-blue-600 transition-all duration-200 shadow-lg text-lg font-comic"
                whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 1, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                {isLogin ? '🚀 Blast Off!' : '🎉 Join the Fun!'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-purple-600 font-comic">
                {isLogin ? "New to our adventure? " : "Already one of us? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-pink-500 font-bold hover:text-pink-600 transition-colors underline"
                >
                  {isLogin ? 'Sign Up!' : 'Sign In!'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side Illustration */}
        <motion.div
          className="hidden lg:block w-1/2 pl-12"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            {/* Main Illustration */}
            <img
              src="/images/education-illustration.svg"
              alt="Education Illustration"
              className="w-full h-auto"
            />

            {/* Floating Elements - More playful animations */}
            <motion.div
              className="absolute top-0 right-0"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <img
                src="/images/floating-books.svg"
                alt="Floating Books"
                className="w-28 h-28"
              />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0"
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0, 5, 0]
              }}
              transition={{
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <img
                src="/images/floating-pencil.svg"
                alt="Floating Pencil"
                className="w-20 h-20"
              />
            </motion.div>

            {/* Additional playful elements */}
            <motion.div
              className="absolute top-1/3 left-1/4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
                🌟
              </div>
            </motion.div>
          </div>

          {/* Text Content - More child-friendly */}
          <div className="mt-8 text-purple-900 bg-white/70 p-6 rounded-2xl border-2 border-purple-300">
            <h2 className="text-3xl font-bold mb-4 font-comic text-purple-600">Join Our Learning Adventure!</h2>
            <p className="text-lg text-purple-700 font-comic">
              Elimu Global is where learning becomes a magical journey!
              Discover exciting lessons, fun quizzes, and make new friends along the way!
            </p>
            <div className="mt-6 flex space-x-4">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center shadow-md">
                  <Book className="w-7 h-7 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-purple-700 font-bold font-comic">1000+</div>
                  <div className="text-purple-600 text-sm font-comic">Fun Lessons</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center shadow-md">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-purple-700 font-bold font-comic">50k+</div>
                  <div className="text-purple-600 text-sm font-comic">Happy Friends</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginSignUp;
