import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Config
import axiosInstance from '../axiosConfig';

// Components
import { ReactComponent as Logo } from '../logo.svg';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10'>
      <div className='flex flex-col items-center bg-white rounded-2xl shadow-xl w-full max-w-sm px-8 py-10'>
        <div className='flex items-center justify-center rounded-xl text-3xl mb-6'>
          <Logo className='w-14 h-14' />
        </div>

        <h2 className='text-xl font-bold text-gray-900 mb-1'>Create Account</h2>
        <p className='text-sm text-gray-500 mb-6'>Sign up to start tracking your packages</p>

        {/* Full Name */}
        <div className='w-full mb-4'>
          <label className='block text-sm text-gray-700 font-medium mb-1'>
            Full Name <span className='text-red-500'>*</span>
          </label>
          <input
            name='name'
            type='text'
            placeholder='John Smith'
            value={formData.name}
            onChange={handleChange}
            className='w-full border-2 border-blue-400 focus:border-blue-600 rounded-lg px-3 py-2.5 text-sm outline-none'
          />
        </div>

        {/* Email */}
        <div className='w-full mb-4'>
          <label className='block text-sm text-gray-700 font-medium mb-1'>
            Email <span className='text-red-500'>*</span>
          </label>
          <input
            name='email'
            type='email'
            placeholder='john@example.com'
            value={formData.email}
            onChange={handleChange}
            className='w-full border-2 border-blue-400 focus:border-blue-600 rounded-lg px-3 py-2.5 text-sm outline-none'
          />
        </div>

        {/* Password */}
        <div className='w-full mb-4'>
          <label className='block text-sm text-gray-700 font-medium mb-1'>
            Password <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              name='password'
              type='password'
              placeholder='At least 6 characters'
              value={formData.password}
              onChange={handleChange}
              className='w-full border-2 border-blue-400 focus:border-blue-600 rounded-lg px-3 py-2.5 text-sm outline-none pr-10'
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='w-full bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 mt-3 mb-1'>
            {error}
          </div>
        )}

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='w-full mt-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-semibold text-sm py-3 rounded-lg shadow-sm'>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <p className='text-sm text-gray-600 mt-4'>
          Already have an account?{' '}
          <span
            className='text-blue-600 font-semibold cursor-pointer hover:underline'
            onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
