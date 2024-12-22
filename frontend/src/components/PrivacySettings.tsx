import { useState } from 'react';
import { motion } from 'framer-motion';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySetting[]>([
    {
      id: 'profile-visibility',
      title: 'Profile Visibility',
      description: 'Make your profile visible to other students and instructors',
      enabled: true
    },
    {
      id: 'activity-tracking',
      title: 'Activity Tracking',
      description: 'Allow us to track your learning progress and activities',
      enabled: true
    },
    {
      id: 'data-collection',
      title: 'Data Collection',
      description: 'Allow us to collect data to improve your learning experience',
      enabled: true
    },
    {
      id: 'third-party',
      title: 'Third-Party Integration',
      description: 'Allow third-party services to enhance your learning experience',
      enabled: false
    }
  ]);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
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
    }
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
        delay: 0.2
      }
    }
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the settings
    alert('Privacy settings saved!');
  };

  const handleSettingChange = (setting: string, checked: boolean) => {
    setSettings(prevSettings =>
      prevSettings.map(s =>
        s.id === setting
          ? { ...s, enabled: checked }
          : s
      )
    );
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Settings</h1>
            <p className="text-gray-600">
              Control your privacy preferences and manage how your information is shared within the platform.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/privacy-illustration.svg"
              alt="Privacy Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Visibility */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Profile Visibility</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Show Online Status</h3>
                  <p className="text-sm text-gray-500">Let others see when you're active</p>
                </div>
                <motion.button
                  type="button"
                  role="switch"
                  aria-checked={settings.find(s => s.id === 'profile-visibility')?.enabled}
                  className={`${
                    settings.find(s => s.id === 'profile-visibility')?.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onClick={() => handleToggle('profile-visibility')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      settings.find(s => s.id === 'profile-visibility')?.enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </motion.button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Profile Searchability</h3>
                  <p className="text-sm text-gray-500">Allow others to find you by name</p>
                </div>
                <motion.button
                  type="button"
                  role="switch"
                  aria-checked={settings.find(s => s.id === 'third-party')?.enabled}
                  className={`${
                    settings.find(s => s.id === 'third-party')?.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onClick={() => handleToggle('third-party')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      settings.find(s => s.id === 'third-party')?.enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Data Sharing */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Sharing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Learning Progress</h3>
                  <p className="text-sm text-gray-500">Share your progress with instructors</p>
                </div>
                <motion.button
                  type="button"
                  role="switch"
                  aria-checked={settings.find(s => s.id === 'activity-tracking')?.enabled}
                  className={`${
                    settings.find(s => s.id === 'activity-tracking')?.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onClick={() => handleToggle('activity-tracking')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      settings.find(s => s.id === 'activity-tracking')?.enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Activity History</h3>
                  <p className="text-sm text-gray-500">Allow access to your learning history</p>
                </div>
                <motion.button
                  type="button"
                  role="switch"
                  aria-checked={settings.find(s => s.id === 'data-collection')?.enabled}
                  className={`${
                    settings.find(s => s.id === 'data-collection')?.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  onClick={() => handleToggle('data-collection')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      settings.find(s => s.id === 'data-collection')?.enabled ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-end"
        >
          <motion.button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Changes
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PrivacySettings;
