import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { config } from '../config/env';
import { Book, Users } from 'react-feather';

function LoginSignUp() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    curriculum: '',
    form: '',
    preferences: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a simple token (in a real app, this would come from your backend)
    const token = btoa(formData.email + ':' + new Date().getTime());
    
    // Store auth token
    localStorage.setItem('userToken', token);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({
      ...formData,
      // Add token and expiry
      token: token,
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }));
    
    // Clear any previously selected plan
    localStorage.removeItem('selectedPlan');
    
    // Simulate sending data to recommendation AI
    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are an AI that provides personalized learning recommendations based on student data.',
            },
            {
              role: 'user',
              content: `New student data: ${JSON.stringify(formData)}. Provide initial learning recommendations.`,
            },
          ],
        }),
      });

      const data = await response.json();
      
      // Store the AI recommendations
      localStorage.setItem('recommendations', JSON.stringify(data));
      
      // Navigate to plan selection
      navigate('/all-students');
      
    } catch (error) {
      console.error('Error:', error);
      // Still navigate even if AI recommendation fails
      navigate('/all-students');
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto flex items-center justify-center px-4">
        {/* Login/Signup Card */}
        <motion.div 
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
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
                      placeholder="Full Name"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <select
                      name="curriculum"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      required
                    >
                      <option value="">Select Curriculum</option>
                      <option value="844">844</option>
                      <option value="CBC">CBC</option>
                      <option value="British">British</option>
                      <option value="American">American</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="form"
                      placeholder="Form/Class"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="preferences"
                      placeholder="Learning Preferences (e.g., Math, Science)"
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
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
