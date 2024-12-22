import { useState } from 'react';
import { motion } from 'framer-motion';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

function LanguagePreferences() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the settings
    alert('Language preferences saved!');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Language & Regional Settings</h1>
            <p className="text-gray-600">
              Customize your language preferences and regional formats for a personalized experience.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/language-illustration.svg"
              alt="Language Settings Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Language Selection */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Display Language</h2>
            <div className="space-y-4">
              {languages.map((language) => (
                <label
                  key={language.code}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="language"
                    value={language.code}
                    checked={selectedLanguage === language.code}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      {language.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {language.nativeName}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Date & Time Format */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Date & Time Format</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Format
                </label>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="12">12-hour (AM/PM)</option>
                  <option value="24">24-hour</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview Section */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Date</h3>
              <p className="text-lg text-gray-900">
                {new Date().toLocaleDateString(selectedLanguage, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Time</h3>
              <p className="text-lg text-gray-900">
                {new Date().toLocaleTimeString(selectedLanguage, {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: timeFormat === '12',
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-end"
        >
          <motion.button
            onClick={handleSave}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Preferences
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LanguagePreferences;
