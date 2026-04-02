import { useState, useEffect } from 'react';

// Auth
import { useAuth } from '../context/AuthContext';

// Config
import axiosInstance from '../axiosConfig';

// Components
import Loading from '../components/Loading';
import Header from '../components/Header';

// PDT-68, PDT-70, PDT-71
const Profile = () => {
  const { user } = useAuth(); // Access user token from context

  // States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          university: response.data.university || '',
          phone: response.data.phone || '',
          address: response.data.address || ''
        });
      } catch (error) {
        showToast('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show toast briefly
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen bg-gray-100 ml-16 flex-1 p-6'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-full'>
          <Header title={'Profile'} user={user} />
        </div>
      </div>

      <div className='flex justify-center bg-gray-100 px-4 pt-16'>
        <div className='flex flex-col items-center bg-white rounded-2xl shadow-xl w-full max-w-sm px-8 py-10'>
          <form onSubmit={handleSubmit} className='w-full'>
            <h1 className='text-2xl font-bold mb-4 text-center'>Your Profile</h1>

            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>Name</label>
              <input
                type='text'
                placeholder='Name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none'
              />
            </div>
            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>Email</label>
              <input
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none'
              />
            </div>
            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>University</label>
              <input
                type='text'
                placeholder='University'
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none'
              />
            </div>
            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>Phone</label>
              <input
                type='text'
                placeholder='Phone'
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none'
              />
            </div>
            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>Address</label>
              <input
                type='text'
                placeholder='Address'
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none'
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-300 text-white text-xs font-semibold py-2.5 rounded-lg'>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className='fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl animate-fade-in'>
          {toast}
        </div>
      )}
    </div>
  );
};

export default Profile;
