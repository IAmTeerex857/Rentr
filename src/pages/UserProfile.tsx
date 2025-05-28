import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, Mail, Phone, MapPin, Home, 
  Save, ArrowLeft, Bell, Lock, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Define the user data interface that extends the User type
  interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    userType: 'seeker' | 'provider'; // Match the UserType from AuthContext
    notifications: {
      email: boolean;
      sms: boolean;
      app: boolean;
    };
    preferences: {
      currency: string;
      language: string;
      newsletter: boolean;
    };
    [key: string]: any; // Index signature to allow string indexing
  }
  
  const defaultUserData: UserData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    userType: 'seeker',
    notifications: {
      email: true,
      sms: false,
      app: true
    },
    preferences: {
      currency: 'USD',
      language: 'English',
      newsletter: true
    }
  };
  
  // Initialize states
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [, setShowSuccessMessage] = useState(false);
  
  // Initialize form data with user data from context or default values
  // Update userData when user changes
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [formData, setFormData] = useState<UserData>(defaultUserData);
  
  useEffect(() => {
    if (user) {
      const updatedUserData = {
        ...userData,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        userType: user.userType,
        notifications: user.notifications || userData.notifications,
        preferences: user.preferences || userData.preferences
      };
      setUserData(updatedUserData);
      setFormData(updatedUserData);
    }
  }, [user, userData]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects like notifications and preferences
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof UserData],
          [child]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Use the updateUserProfile function from AuthContext
      // Convert UserData to Partial<User>
      const userDataToUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        userType: formData.userType,
        notifications: formData.notifications,
        preferences: formData.preferences
      };
      
      const result = await updateUserProfile(userDataToUpdate);
      
      if (result.success) {
        setUserData(formData);
        setIsEditing(false);
        
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        // Handle error
        console.error('Failed to update profile:', result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <UserIcon className="h-10 w-10 text-airbnb-red mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userData.firstName} {userData.lastName}</h1>
                <p className="text-gray-600">{userData.userType === 'seeker' ? 'Property Seeker' : 'Property Provider'}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                  activeTab === 'personal'
                    ? 'bg-red-50 text-airbnb-red'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Personal Info
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                  activeTab === 'security'
                    ? 'bg-red-50 text-airbnb-red'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Lock className="h-5 w-5 mr-3" />
                Security
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                  activeTab === 'notifications'
                    ? 'bg-red-50 text-airbnb-red'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
              </button>
              
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                  activeTab === 'preferences'
                    ? 'bg-red-50 text-airbnb-red'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                Preferences
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'personal' && 'Personal Information'}
                {activeTab === 'security' && 'Security Settings'}
                {activeTab === 'notifications' && 'Notification Preferences'}
                {activeTab === 'preferences' && 'Account Preferences'}
              </h1>
              
              {activeTab === 'personal' && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div>
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Type
                        </label>
                        <select
                          name="userType"
                          value={formData.userType}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        >
                          <option value="seeker">Property Seeker</option>
                          <option value="provider">Property Provider</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex space-x-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(userData);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">{userData.firstName} {userData.lastName}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {userData.email}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {userData.phone}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {userData.address}, {userData.city}, {userData.country}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">User Type</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900 capitalize">{userData.userType}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        required
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Password must be at least 8 characters and include a number and a special character.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-airbnb-red text-white rounded-lg text-sm font-medium hover:bg-airbnb-red/90"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Deletion</h3>
                  <p className="text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                  <form className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          name="notifications.email"
                          checked={formData.notifications.email}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
                        />
                        <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                          {formData.notifications.email ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates and alerts via text message</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sms-notifications"
                          name="notifications.sms"
                          checked={formData.notifications.sms}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
                        />
                        <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                          {formData.notifications.sms ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">App Notifications</h4>
                        <p className="text-sm text-gray-500">Receive in-app notifications</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="app-notifications"
                          name="notifications.app"
                          checked={formData.notifications.app}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
                        />
                        <label htmlFor="app-notifications" className="ml-2 block text-sm text-gray-700">
                          {formData.notifications.app ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-airbnb-red text-white rounded-lg text-sm font-medium hover:bg-airbnb-red/90"
                    >
                      Save Notification Preferences
                    </button>
                  </form>
                </div>
              </div>
            )}
            
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Preferences</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        name="preferences.currency"
                        value={formData.preferences.currency}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="TRY">TRY (₺)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        name="preferences.language"
                        value={formData.preferences.language}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-red focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Turkish">Turkish</option>
                        <option value="Russian">Russian</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="newsletter"
                        name="preferences.newsletter"
                        checked={formData.preferences.newsletter}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-airbnb-red focus:ring-airbnb-red border-gray-300 rounded"
                      />
                      <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                        Subscribe to newsletter
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      className="px-4 py-2 bg-airbnb-red text-white rounded-lg text-sm font-medium hover:bg-airbnb-red/90"
                    >
                      Save Preferences
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
