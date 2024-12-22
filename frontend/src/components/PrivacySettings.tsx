import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';

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

  return (
    <PageContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Privacy Settings</h2>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-blue-800">{setting.title}</h3>
                  <p className="text-gray-600 text-sm">{setting.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <motion.button
                    type="button"
                    role="switch"
                    aria-checked={setting.enabled}
                    className={`${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onClick={() => handleToggle(setting.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Data Management</h3>
            <div className="space-y-4">
              <motion.button
                type="button"
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Here you would typically make an API call to request data deletion
                  if (window.confirm('Are you sure you want to request your data deletion? This action cannot be undone.')) {
                    alert('Data deletion request submitted. We will process your request within 30 days.');
                  }
                }}
              >
                Request Data Deletion
              </motion.button>
              <motion.button
                type="button"
                className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Here you would typically make an API call to download user data
                  alert('Your data export request has been received. We will email you when it\'s ready for download.');
                }}
              >
                Download My Data
              </motion.button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Here you would typically make an API call to save the settings
                alert('Privacy settings saved!');
              }}
            >
              Save Settings
            </motion.button>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default PrivacySettings;
