import { useState, useEffect } from 'react';

// Auth
import { useAuth } from '../context/AuthContext';

// Config
import axiosInstance from '../axiosConfig';

// Components
import Loading from '../components/Loading';
import Header from '../components/Header';

const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

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
          address: response.data.address || ''
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
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
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen bg-gray-100 ml-16 flex-1 p-6'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-full'>
          <Header title={'Track Packages'} user={user} />
        </div>
      </div>
      <div className='flex justify-center bg-gray-100 px-4 pt-16'>
        <div className='flex flex-col items-center bg-white rounded-2xl shadow-xl w-full max-w-sm px-8 py-10'>
          <form onSubmit={handleSubmit} className='w-full'>
            <h1 className='text-2xl font-bold mb-4 text-center'>Your Profile</h1>

            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>Email</label>
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
              <label className='block text-sm text-gray-700 font-medium mb-1'>Email</label>
              <input
                type='text'
                placeholder='University'
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none'
              />
            </div>
            <div className='w-full mb-4'>
              <label className='block text-sm text-gray-700 font-medium mb-1'>Email</label>
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
    </div>
  );
};

export default Profile;
