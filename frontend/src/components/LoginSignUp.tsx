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

      // Store the token
      localStorage.setItem('userToken', token);
      
      // Store user data
      const userData = {
        ...(isLogin ? response.data.user : response.data),
        token: token,
        expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Clear any previously selected plan if needed
      localStorage.removeItem('selectedPlan');

      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Navigate based on login or registration
      navigate(isLogin ? '/dashboard' : '/onboarding');
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
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
      <div className="flex items-center justify-center">
        {/* Login/Signup Card */}
        <motion.div 
          className="max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo or Brand Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Elimu Global</h2>
            <p className="text-blue-100">Your Gateway to Quality Education</p>
          </div>

          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isLogin ? 'Welcome Back!' : 'Create Your Account'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                      required
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                  </div>
                </>
              )}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                  required
                />
                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black pr-16"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              </div>
              {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
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
            
            {/* Floating Elements */}
            <motion.div
              className="absolute top-0 right-0"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="/images/floating-books.svg"
                alt="Floating Books"
                className="w-24 h-24"
              />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <img
                src="/images/floating-pencil.svg"
                alt="Floating Pencil"
                className="w-16 h-16"
              />
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="mt-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Transform Your Learning Journey</h2>
            <p className="text-lg text-blue-100">
              Join Elimu Global and experience personalized education tailored to your needs.
              Our AI-powered platform helps you achieve your academic goals efficiently.
            </p>
            <div className="mt-6 flex space-x-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-white font-semibold">1000+</div>
                  <div className="text-blue-100 text-sm">Courses</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-white font-semibold">50k+</div>
                  <div className="text-blue-100 text-sm">Students</div>
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
