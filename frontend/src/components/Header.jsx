import { ReactComponent as Logo } from '../logo.svg';

const Header = ({ title, user }) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center justify-center gap-3'>
        <Logo className='w-10 h-10' />
        <h2 className='text-lg font-bold text-gray-900'>{title ? title : 'Package Tracking'}</h2>
      </div>
      <div className='flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm select-none'>
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default Header;
