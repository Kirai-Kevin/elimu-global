import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';
import { Link } from 'react-router-dom';

function MoreOptions() {
  const [showChatbot, setShowChatbot] = useState(false);
  const faqs = [
    { question: "How do I schedule a class?", answer: "You can schedule a class by visiting the Classes section and selecting your preferred time slot with an available instructor." },
    { question: "What if I miss a class?", answer: "If you miss a class, you can access the recorded version in your Materials section. You can also reschedule with your instructor for a different time." },
    { question: "How can I get a certificate for completed courses?", answer: "Certificates are automatically generated upon successful completion of a course. You can find and download them from your Achievements page." },
  ];

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
      >
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">More Options</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Settings</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/settings/account" 
                  className="flex items-center p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <span className="text-lg">👤</span>
                  <span className="ml-2">Account Settings</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings/notifications" 
                  className="flex items-center p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <span className="text-lg">🔔</span>
                  <span className="ml-2">Notification Preferences</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings/privacy" 
                  className="flex items-center p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <span className="text-lg">🔒</span>
                  <span className="ml-2">Privacy Settings</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings/language" 
                  className="flex items-center p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  <span className="text-lg">🌍</span>
                  <span className="ml-2">Language Preferences</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Help & Support</h3>
            <motion.button
              onClick={() => setShowChatbot(!showChatbot)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showChatbot ? 'Close Chatbot' : 'Open Chatbot'}
            </motion.button>
            {showChatbot && (
              <motion.div
                className="mt-4 p-4 border rounded-xl border-blue-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <p>Chatbot: Hello! How can I assist you today?</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md p-6"
                variants={itemVariants}
              >
                <h4 className="text-lg font-semibold mb-2 text-blue-700">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}

export default MoreOptions;
