import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'classes',
      title: 'Class Reminders',
      description: 'Get notified about upcoming classes and schedule changes',
      email: true,
      push: true,
      sms: false
    },
    {
      id: 'assignments',
      title: 'Assignment Updates',
      description: 'Receive notifications about new assignments and due dates',
      email: true,
      push: true,
      sms: true
    },
    {
      id: 'grades',
      title: 'Grade Updates',
      description: 'Get notified when new grades are posted',
      email: true,
      push: false,
      sms: false
    },
    {
      id: 'announcements',
      title: 'General Announcements',
      description: 'Stay informed about important school announcements',
      email: true,
      push: true,
      sms: false
    }
  ]);

  const handleToggle = (id: string, type: 'email' | 'push' | 'sms') => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id
          ? { ...setting, [type]: !setting[type] }
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
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
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Notification Preferences</h2>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            {settings.map((setting) => (
              <motion.div
                key={setting.id}
                variants={itemVariants}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-blue-800">{setting.title}</h3>
                  <p className="text-gray-600 text-sm">{setting.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.email}
                        onChange={() => handleToggle(setting.id, 'email')}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Email</span>
                    </label>
                  </div>

                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.push}
                        onChange={() => handleToggle(setting.id, 'push')}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Push</span>
                    </label>
                  </div>

                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.sms}
                        onChange={() => handleToggle(setting.id, 'sms')}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">SMS</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <motion.button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Here you would typically make an API call to save the settings
                alert('Notification preferences saved!');
              }}
            >
              Save Preferences
            </motion.button>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
}

export default NotificationPreferences;
