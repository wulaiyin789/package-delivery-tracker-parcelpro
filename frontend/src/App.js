import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CourierDashboard from './pages/CourierDashboard';
import CreateShipment from './pages/CreateShipment';
import TrackPackage from './pages/TrackPackage';
import TrackPackageLimited from './pages/TrackPackageLimited';
import Track from './pages/Track';
import UserManagement from './pages/UserManagement';
import Landing from './pages/Landing';

// Auth
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/track' element={<Track />} />

        {user && <Route path='/profile' element={<Profile />} />}

        {/* Customer */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute roles={['CUSTOMER', 'ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Courier */}
        <Route
          path='/courier'
          element={
            <ProtectedRoute roles={['COURIER', 'ADMIN']}>
              <CourierDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path='/users/manage'
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Shared */}
        <Route
          path='/shipments/create'
          element={
            <ProtectedRoute>
              <CreateShipment />
            </ProtectedRoute>
          }
        />

        <Route
          path='/track/:trackingId'
          element={
            <ProtectedRoute>
              <TrackPackage />
            </ProtectedRoute>
          }
        />

        <Route path='/track/public/:trackingId' element={<TrackPackageLimited />} />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </Router>
  );
}

export default App;
