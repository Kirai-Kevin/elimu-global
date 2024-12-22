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
    <PageContainer>
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center mb-8">
          <Settings className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-blue-800">Account Settings</h1>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100"
          variants={itemVariants}
        >
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-blue-600 mb-2">
                  <User className="w-5 h-5 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center text-blue-600 mb-2">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editedData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center text-blue-600 mb-2">
                  <Phone className="w-5 h-5 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center text-blue-600 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Curriculum
                </label>
                <select
                  name="curriculum"
                  value={editedData.curriculum}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Curriculum</option>
                  <option value="844">844</option>
                  <option value="CBC">CBC</option>
                  <option value="British">British</option>
                  <option value="American">American</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-blue-600 mb-2">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Form/Class
                </label>
                <input
                  type="text"
                  name="form"
                  value={editedData.form}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center text-blue-600 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learning Preferences
                </label>
                <input
                  type="text"
                  name="preferences"
                  value={editedData.preferences}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center border-b border-blue-100 pb-4">
                <User className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-blue-600">Full Name</div>
                  <div className="text-lg font-medium text-blue-900">{userData.name}</div>
                </div>
              </div>

              <div className="flex items-center border-b border-blue-100 pb-4">
                <Mail className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-blue-600">Email</div>
                  <div className="text-lg font-medium text-blue-900">{userData.email}</div>
                </div>
              </div>

              <div className="flex items-center border-b border-blue-100 pb-4">
                <Phone className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-blue-600">Phone Number</div>
                  <div className="text-lg font-medium text-blue-900">{userData.phone}</div>
                </div>
              </div>

              <div className="flex items-center border-b border-blue-100 pb-4">
                <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-blue-600">Curriculum</div>
                  <div className="text-lg font-medium text-blue-900">{userData.curriculum}</div>
                </div>
              </div>

              <div className="flex items-center border-b border-blue-100 pb-4">
                <GraduationCap className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-blue-600">Form/Class</div>
                  <div className="text-lg font-medium text-blue-900">{userData.form}</div>
                </div>
              </div>

              <div className="flex items-center border-b border-blue-100 pb-4">
                <BookOpen className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-blue-600">Learning Preferences</div>
                  <div className="text-lg font-medium text-blue-900">{userData.preferences}</div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}

export default AccountSettings;
