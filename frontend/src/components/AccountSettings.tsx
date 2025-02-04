import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, GraduationCap, Settings, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import { authenticatedGet, authenticatedPost, authenticatedPut, apiClient } from '../utils/api';

interface UserProfile {
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  curriculum?: string;
  form?: string;
  preferences?: string;
  profilePhotoUrl?: string | null;
  recommendedCourses?: string[];
}

function AccountSettings() {
  const initialProfileState: UserProfile = {
    userId: '',
    name: '',
    email: '',
    phone: '',
    curriculum: '',
    form: '',
    preferences: '',
    profilePhotoUrl: null,
    recommendedCourses: []
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfileState);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(initialProfileState);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (successNote) {
      timeoutId = setTimeout(() => {
        setSuccessNote(null);
      }, 5000); // Clear after 5 seconds
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [successNote]);

  const fetchUserProfile = async () => {
    try {
      const profileResponse = await authenticatedGet('/student/profile');
      const profileData = profileResponse.data;
      
      // Fetch profile photo separately
      try {
        const photoResponse = await authenticatedGet('/student/profile/photo');
        // Update profile data with photo URL
        profileData.profilePhotoUrl = photoResponse.data.photoUrl;
      } catch (photoError) {
        // If photo fetch fails, set to null
        console.warn('Could not fetch profile photo:', photoError);
        profileData.profilePhotoUrl = null;
      }

      setUserProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Photo size should be less than 5MB');
        return;
      }
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhoto) return;

    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', profilePhoto);

      await authenticatedPut('/student/profile/photo', formData);

      // Fetch the updated photo URL
      const photoResponse = await authenticatedGet('/student/profile/photo');

      // Update profile photo URL
      setUserProfile(prev => ({
        ...prev,
        profilePhotoUrl: photoResponse.data.photoUrl
      }));

      toast.success('Profile photo uploaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset photo selection
      setProfilePhoto(null);
      setPreviewPhoto(null);
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Failed to upload profile photo. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await authenticatedPut('/student/profile/photo/remove', {});
      
      // Update profile with null photo URL
      setUserProfile(prev => ({
        ...prev,
        profilePhotoUrl: null
      }));
      
      setPreviewPhoto(null);
      setProfilePhoto(null);
      toast.success('Profile photo removed successfully!');
    } catch (error) {
      console.error('Error removing profile photo:', error);
      toast.error('Failed to remove profile photo');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare the update payload
      const updatePayload = {
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
        curriculum: editedProfile.curriculum,
        form: editedProfile.form,
        preferences: editedProfile.preferences
      };

      // Make API call to update user profile
      const response = await authenticatedPut('/student/profile', updatePayload);
      
      if (response.ok) {
        // Update state
        setUserProfile(prev => ({
          ...prev,
          ...updatePayload
        }));
        setIsEditing(false);

        // Set success note
        setSuccessNote('Your profile details have been successfully updated.');

        // Show success toast
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error('Failed to update profile', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
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
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {isUploadingPhoto ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <img 
                  src={previewPhoto || userProfile.profilePhotoUrl || '/assets/images/default-avatar.png'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgLz48L3N2Zz4=';
                  }}
                />
              )}
            </div>
            <input 
              type="file" 
              id="profilePhotoUpload"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePhotoChange}
              disabled={isUploadingPhoto}
            />
            <label 
              htmlFor="profilePhotoUpload"
              className={`absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 ${isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Camera size={16} />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            {profilePhoto && (
              <button 
                onClick={uploadProfilePhoto}
                disabled={isUploadingPhoto}
                className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 ${isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </button>
            )}
            {(userProfile.profilePhotoUrl || previewPhoto) && (
              <button 
                onClick={handleRemovePhoto}
                disabled={isUploadingPhoto}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>

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
                  value={isEditing ? editedProfile.name : userProfile.name}
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
                  value={isEditing ? editedProfile.email : userProfile.email}
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
                  value={isEditing ? editedProfile.phone : userProfile.phone}
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
                  value={isEditing ? editedProfile.curriculum : userProfile.curriculum}
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
                  value={isEditing ? editedProfile.form : userProfile.form}
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
                  value={isEditing ? editedProfile.preferences : userProfile.preferences}
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
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
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
          {isEditing && (
            <motion.button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-600 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          )}
        </motion.div>

        {/* Success Note */}
        {successNote && (
          <motion.div
            variants={itemVariants}
            className="mt-8 text-green-600"
          >
            {successNote}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default AccountSettings;
