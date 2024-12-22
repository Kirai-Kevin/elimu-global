import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';
import { Link } from 'react-router-dom';
import { Settings, Bell, Lock, Globe, HelpCircle, MessageSquare } from 'lucide-react';

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
      path: "/more/account", 
      icon: Settings,
      description: "Manage your profile, curriculum, and learning preferences"
    },
    { 
      name: "Notification Preferences", 
      path: "/more/notifications", 
      icon: Bell,
      description: "Control your email, push, and SMS notifications"
    },
    { 
      name: "Privacy Settings", 
      path: "/more/privacy", 
      icon: Lock,
      description: "Manage your data and privacy preferences"
    },
    { 
      name: "Language Preferences", 
      path: "/more/language", 
      icon: Globe,
      description: "Set your preferred language and content preferences"
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

  return (
    <PageContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <h2 className="text-3xl font-bold text-blue-600 mb-8">More Options</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Settings Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-6 text-blue-800">Settings</h3>
            <div className="space-y-4">
              {settingsLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <link.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-blue-900">{link.name}</h4>
                    <p className="text-sm text-blue-600">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Help & Support Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-semibold mb-6 text-blue-800">Help & Support</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-6 h-6 text-blue-500 mr-2" />
                  <h4 className="text-lg font-medium text-blue-900">Need Help?</h4>
                </div>
                <p className="text-blue-600 mb-4">Get instant help from our AI-powered assistant</p>
                <motion.button
                  onClick={() => setShowChatbot(!showChatbot)}
                  className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {showChatbot ? 'Close Chatbot' : 'Open Chatbot'}
                </motion.button>
              </div>
              
              {showChatbot && (
                <motion.div
                  className="p-4 bg-white border-2 border-blue-100 rounded-xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <p className="ml-3 font-medium text-blue-900">AI Assistant</p>
                  </div>
                  <p className="text-blue-600">Hello! How can I help you with your learning journey today?</p>
                </motion.div>
              )}
            </div>
          </motion.div>
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
      </motion.div>
    </PageContainer>
  );
}

export default MoreOptions;
