import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from './PageContainer';

interface Language {
  code: string;
  name: string;
  localName: string;
}

interface ContentPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

function LanguagePreferences() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [contentPreferences, setContentPreferences] = useState<ContentPreference[]>([
    {
      id: 'auto-translate',
      title: 'Auto-Translate Content',
      description: 'Automatically translate content to your preferred language',
      enabled: true
    },
    {
      id: 'show-original',
      title: 'Show Original Text',
      description: 'Display original text alongside translations',
      enabled: false
    },
    {
      id: 'translate-chat',
      title: 'Translate Chat Messages',
      description: 'Automatically translate chat messages in discussions',
      enabled: true
    }
  ]);

  const languages: Language[] = [
    { code: 'en', name: 'English', localName: 'English' },
    { code: 'sw', name: 'Swahili', localName: 'Kiswahili' },
    { code: 'fr', name: 'French', localName: 'Français' },
    { code: 'ar', name: 'Arabic', localName: 'العربية' },
    { code: 'es', name: 'Spanish', localName: 'Español' },
    { code: 'zh', name: 'Chinese', localName: '中文' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleToggle = (id: string) => {
    setContentPreferences(prevPreferences =>
      prevPreferences.map(pref =>
        pref.id === id
          ? { ...pref, enabled: !pref.enabled }
          : pref
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
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Language Preferences</h2>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Primary Language</h3>
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.localName})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Content Preferences</h3>
            <div className="space-y-6">
              {contentPreferences.map((pref) => (
                <div key={pref.id} className="flex items-center justify-between">
                  <div className="flex-grow">
                    <h4 className="text-base font-medium text-gray-900">{pref.title}</h4>
                    <p className="text-sm text-gray-600">{pref.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <motion.button
                      type="button"
                      role="switch"
                      aria-checked={pref.enabled}
                      className={`${
                        pref.enabled ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      onClick={() => handleToggle(pref.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          pref.enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Language Support</h3>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
              <p>Need help with language settings? Contact our support team for assistance with:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Adding new languages</li>
                <li>Translation quality feedback</li>
                <li>Language-specific issues</li>
              </ul>
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
                alert('Language preferences saved!');
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

export default LanguagePreferences;
