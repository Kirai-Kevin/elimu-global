import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@headlessui/react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'assignments',
      title: 'Assignment Updates',
      description: 'Get notified about new assignments and deadlines',
      enabled: true,
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Receive notifications for new messages from instructors',
      enabled: true,
    },
    {
      id: 'progress',
      title: 'Learning Progress',
      description: 'Updates about your learning progress and achievements',
      enabled: true,
    },
    {
      id: 'reminders',
      title: 'Class Reminders',
      description: 'Reminders for upcoming classes and events',
      enabled: true,
    },
  ]);

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

  const handleSettingChange = (id: string, enabled: boolean) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, enabled } : setting
    ));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the settings
    alert('Notification preferences saved!');
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Notification Preferences</h1>
            <p className="text-gray-600">
              Choose how and when you want to receive notifications about your learning journey.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/notifications-illustration.svg"
              alt="Notifications Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{setting.title}</h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
                <Switch
                  checked={setting.enabled}
                  onChange={(checked) => handleSettingChange(setting.id, checked)}
                  className={`${
                    setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      setting.enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email Preferences */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Email Frequency</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="instant"
                name="emailFrequency"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="instant" className="ml-3">
                <span className="block text-sm font-medium text-gray-700">Instant</span>
                <span className="block text-sm text-gray-500">Receive emails as events happen</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="daily"
                name="emailFrequency"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="daily" className="ml-3">
                <span className="block text-sm font-medium text-gray-700">Daily Digest</span>
                <span className="block text-sm text-gray-500">Get a summary of notifications once a day</span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="weekly"
                name="emailFrequency"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="weekly" className="ml-3">
                <span className="block text-sm font-medium text-gray-700">Weekly Digest</span>
                <span className="block text-sm text-gray-500">Get a summary of notifications once a week</span>
              </label>
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

export default NotificationPreferences;
