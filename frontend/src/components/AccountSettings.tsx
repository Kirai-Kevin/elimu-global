import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, GraduationCap, Settings } from 'lucide-react';
import PageContainer from './PageContainer';

interface UserData {
  name: string;
  email: string;
  phone: string;
  curriculum: string;
  form: string;
  preferences: string;
}

function AccountSettings() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    curriculum: '',
    form: '',
    preferences: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    curriculum: '',
    form: '',
    preferences: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setEditedData(parsedUser);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = () => {
    // Update localStorage with new data
    localStorage.setItem('user', JSON.stringify(editedData));
    setUserData(editedData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    });
  };

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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Settings</h1>
            <p className="text-gray-600">
              Manage your personal information and account preferences to enhance your learning experience.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/images/account-settings-illustration.svg"
              alt="Account Settings Illustration"
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>

        {/* Settings Form */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? editedData.name : userData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={isEditing ? editedData.email : userData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={isEditing ? editedData.phone : userData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>

          {/* Academic Information */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Academic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum</label>
                <select
                  name="curriculum"
                  value={isEditing ? editedData.curriculum : userData.curriculum}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="">Select Curriculum</option>
                  <option value="844">844</option>
                  <option value="CBC">CBC</option>
                  <option value="British">British</option>
                  <option value="American">American</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form/Class</label>
                <input
                  type="text"
                  name="form"
                  value={isEditing ? editedData.form : userData.form}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learning Preferences</label>
                <input
                  type="text"
                  name="preferences"
                  value={isEditing ? editedData.preferences : userData.preferences}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Math, Science"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex justify-end"
        >
          {isEditing ? (
            <motion.button
              onClick={handleSave}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          ) : (
            <motion.button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Profile
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AccountSettings;
