import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4'>
      <div className='w-72 h-64 bg-gray-300 rounded-2xl flex items-center justify-center text-8xl mb-8 shadow-sm'>
        🚚
      </div>

      <h1 className='text-2xl font-bold text-gray-900 mb-6 tracking-tight'>Parcel Pro</h1>
      <p className='text-sm text-gray-500 mb-6'>A universal package delivery tracking platform to find your packages</p>

      <button
        onClick={() => navigate('/login')}
        className='bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base px-12 py-3 rounded-lg shadow-md'>
        Start
      </button>
    </div>
  );
};

export default Landing;
