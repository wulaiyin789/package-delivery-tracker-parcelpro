import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth
import { useAuth } from '../context/AuthContext';

const Track = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }
    setError('');

    // If user is logged in, go to authenticated tracking page, else go to public tracking page
    if (user) {
      navigate(`/track/${trackingId.trim()}`);
    } else {
      navigate(`/track/public/${trackingId.trim()}`);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100 pt-16 pl-16'>
      <div className='flex-1 flex justify-center p-6'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-2xl shadow-sm p-8 mt-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-6 text-center'>Enter Tracking ID</h3>

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <input
                  type='text'
                  placeholder='Enter your tracking ID'
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className='w-full border border-gray-200 focus:border-blue-500 rounded-lg px-4 py-3 text-sm outline-none transition-colors'
                />
              </div>

              {error && (
                <div className='mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2'>
                  {error}
                </div>
              )}

              <button
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors'>
                Track Package
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
