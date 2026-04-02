import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdLocationOn, MdLocalShipping, MdPerson, MdLogout, MdPersonAdd } from 'react-icons/md';
import { ReactComponent as Logo } from '../logo.svg';

// Auth
import { useAuth } from '../context/AuthContext';

const CUSTOMER_NAV = [
  { to: '/dashboard', icon: <MdDashboard size={22} />, label: 'Dashboard' },
  { to: '/track', icon: <MdLocationOn size={22} />, label: 'Track' },
  { to: '/shipments/create', icon: <MdLocalShipping size={22} />, label: 'Shipments' },
  { to: '/profile', icon: <MdPerson size={22} />, label: 'Profile' }
];

const COURIER_NAV = [
  { to: '/courier', icon: <MdDashboard size={22} />, label: 'Dashboard' },
  { to: '/track', icon: <MdLocationOn size={22} />, label: 'Track' },
  { to: '/profile', icon: <MdPerson size={22} />, label: 'Profile' }
];

const ADMIN_NAV = [
  { to: '/dashboard', icon: <MdDashboard size={22} />, label: 'Dashboard' },
  { to: '/shipments/create', icon: <MdLocalShipping size={22} />, label: 'Shipments' },
  { to: '/profile', icon: <MdPerson size={22} />, label: 'Users' },
  { to: '/track', icon: <MdLocationOn size={22} />, label: 'Track' },
  { to: '/users/manage', icon: <MdPersonAdd size={22} />, label: 'Manage Users' }
];

const GUEST_NAV = [{ to: '/track', icon: <MdLocationOn size={22} />, label: 'Track' }];

const NAV_ITEMS_BY_ROLE = {
  CUSTOMER: CUSTOMER_NAV,
  COURIER: COURIER_NAV,
  ADMIN: ADMIN_NAV
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = NAV_ITEMS_BY_ROLE[user?.role] || GUEST_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className='flex flex-col items-center fixed top-0 left-0 h-screen w-16 bg-gray-900 py-5 z-50'>
      {/* Logo */}
      <NavLink
        to={user?.role === 'COURIER' ? '/courier' : user?.role === ('CUSTOMER' || 'ADMIN') ? '/dashboard' : '/'}
        className='flex items-center justify-center rounded-xl text-xl mb-8 transition-colors select-none'
        title='Home'>
        <Logo className='w-10 h-10' />
      </NavLink>

      {/* All Nav Links */}
      <nav className='flex flex-col items-center gap-2 flex-1'>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `w-11 h-11 rounded-xl flex items-center justify-center
              ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }>
            {icon}
          </NavLink>
        ))}
      </nav>

      {/* Login or Logout */}
      {user ? (
        <button
          onClick={handleLogout}
          title='Logout'
          className='w-11 h-11 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400'>
          <MdLogout size={22} />
        </button>
      ) : (
        <button
          onClick={() => navigate('/login')}
          title='Login'
          className='w-11 h-11 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white'>
          <MdPerson size={22} />
        </button>
      )}
    </aside>
  );
};

export default Navbar;
