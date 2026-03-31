import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth
import { useAuth } from '../context/AuthContext';

// Config
import axiosInstance from '../axiosConfig';

const Login = () => {
  // States
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data, response.data.token);

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4 pt-16'>
      <div className='flex flex-col items-center bg-white rounded-2xl shadow-xl w-full max-w-sm px-8 py-10'>
        <div className='flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl text-3xl mb-6 shadow-md'>
          📦
        </div>

        {/* Email */}
        <div className='w-full mb-4'>
          <label className='block text-sm text-gray-700 font-medium mb-1'>Email</label>
          <input
            name='email'
            type='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            className='w-full border-2 border-blue-400 focus:border-blue-600 rounded-lg px-3 py-2.5 text-sm outline-none'
          />
        </div>

        {/* Password */}
        <div className='w-full mb-1'>
          <label className='block text-sm text-gray-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input
              name='password'
              type='password'
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
              className='w-full border-2 border-blue-400 focus:border-blue-600 rounded-lg px-3 py-2.5 text-sm outline-none pr-10'
            />
          </div>
        </div>

        {/* Forgot Password */}
        <button
          className='self-start text-xs text-blue-500 hover:text-blue-600 mb-5 mt-1'
          onClick={() => navigate('/forgot-password')}>
          Forgot password?
        </button>

        {/* Error */}
        {error && (
          <div className='w-full bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 mb-4'>
            {error}
          </div>
        )}

        {/* Login Button */}
        <div className='flex gap-2 w-full mb-4'>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className='flex-1 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-300 text-white text-xs font-semibold py-2.5 rounded-lg'>
            {'Sign In'}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className='text-sm text-gray-600'>
          Don't have an account?{' '}
          <span
            className='text-blue-600 font-semibold cursor-pointer hover:underline'
            onClick={() => navigate('/register')}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
