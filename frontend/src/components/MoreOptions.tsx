import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, Bell, Lock, Globe, User, LogOut, HelpCircle, MessageSquare, ChevronRight } from 'lucide-react';
import PageContainer from './PageContainer';

function MoreOptions() {
  const [showChatbot, setShowChatbot] = useState(false);
  const faqs = [
    { question: "How do I schedule a class?", answer: "You can schedule a class by visiting the Classes section and selecting your preferred time slot with an available instructor." },
    { question: "What if I miss a class?", answer: "If you miss a class, you can access the recorded version in your Materials section. You can also reschedule with your instructor for a different time." },
    { question: "How can I get a certificate for completed courses?", answer: "Certificates are automatically generated upon successful completion of a course. You can find and download them from your Achievements page." },
  ];

  const settingsLinks = [
    { 
      name: "Account Settings", 
      path: "/dashboard/more/account", 
      icon: User,
      description: "Manage your account details and preferences"
    },
    { 
      name: "Notification Preferences", 
      path: "/dashboard/more/notifications", 
      icon: Bell,
      description: "Control your notification settings"
    },
    { 
      name: "Privacy Settings", 
      path: "/dashboard/more/privacy", 
      icon: Lock,
      description: "Manage your privacy and security settings"
    },
    { 
      name: "Language Preferences", 
      path: "/dashboard/more/language", 
      icon: Globe,
      description: "Change your language settings"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Illustration */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Settings & Preferences</h1>
            <p className="text-gray-600">
              Customize your learning experience by managing your account settings, notifications, privacy, and language preferences.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/settings-illustration.svg"
              alt="Settings Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {settingsLinks.map((link, index) => (
            <motion.div
              key={link.path}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={link.path} className="block">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <link.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{link.name}</h3>
                      <p className="text-gray-600">{link.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <span className="mr-2">Configure</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQs Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 text-blue-800">Frequently Asked Questions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6"
                variants={itemVariants}
              >
                <h4 className="text-lg font-semibold mb-3 text-blue-700">{faq.question}</h4>
                <p className="text-blue-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-8 w-full p-6 bg-red-50 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center text-red-600"
        >
          <LogOut className="w-6 h-6 mr-2" />
          <span className="text-lg font-semibold">Log Out</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default MoreOptions;
