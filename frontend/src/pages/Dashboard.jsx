import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

// Components
import StatesCard from '../components/StatesCard';

// Auth
import { useAuth } from '../context/AuthContext';

// Config
import axiosInstance from '../axiosConfig';
import Loading from '../components/Loading';
import Header from '../components/Header';

// Constants
import { STATUS_OPTIONS } from '../helper/constants';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'ADMIN';

  // PUT /api/shipments/:id/status  — admin only
  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axiosInstance.put(`/api/shipments/${id}/status`, { status });
      setShipments((prev) => {
        return prev.map((s) => (s._id === id ? { ...s, status } : s));
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  // DELETE /api/shipments/:id — admin only
  const confirmDelete = async () => {
    setDeleting(true);

    try {
      await axiosInstance.delete(`/api/shipments/${deleteModal.id}`);
      setShipments((prev) => prev.filter((s) => s._id !== deleteModal.id));
      setDeleteModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel shipment');
    } finally {
      setDeleting(false);
    }
  };

  // GET /api/shipments
  const fetchShipments = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/api/shipments');
      setShipments(data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const stats = {
    total: shipments.length,
    in_transit: shipments.filter((s) => s.status === 'IN_TRANSIT').length,
    delivered: shipments.filter((s) => s.status === 'DELIVERED').length,
    pending: shipments.filter((s) => s.status === 'PENDING').length
  };

  //TODO Further work: Add server-side search for better performance with large datasets + pagination
  const filtered = shipments.filter(
    (s) =>
      s.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      s.recipient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <main className='ml-16 flex-1 p-6'>
        <div className='mb-6'>
          <Header user={user} />
        </div>

        {/* Welcome Banner */}
        <div className='bg-gradient-to-r from-purple-700 to-blue-600 rounded-2xl px-7 py-6 text-white mb-6'>
          <h2 className='text-xl font-bold mb-1'>Welcome back, {user?.name}! 👋</h2>
          <p className='text-sm text-white/80'>Track your packages and manage your shipments all in one place</p>
        </div>

        {/* Stat Cards */}
        <div className='flex gap-4 mb-6 flex-wrap'>
          <StatesCard label='Total Packages' value={stats.total} />
          <StatesCard label='In Transit' value={stats.in_transit} valueClass='text-yellow-600' />
          <StatesCard label='Delivered' value={stats.delivered} valueClass='text-green-600' />
          <StatesCard label='Pending' value={stats.pending} valueClass='text-gray-500' />
        </div>

        {/* Search + Create */}
        <div className='flex gap-3 mb-5 items-center'>
          <input
            className='flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors'
            placeholder='Search by tracking ID, receiver name or courier'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchShipments}
            className='bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap'>
            Refresh
          </button>
          <button
            onClick={() => navigate('/shipments/create')}
            className='bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap'>
            + Create New Shipment
          </button>
        </div>

        {/* Package List */}
        <h3 className='text-base font-bold text-gray-900 mb-3'>My Packages</h3>

        {loading ? (
          <Loading />
        ) : error ? (
          <div className='bg-red-50 border border-red-200 text-red-600 rounded-xl p-10 text-center shadow-sm'>
            <p className='text-4xl mb-3'>❌</p>
            <p className='font-medium'>Error loading shipments</p>
            <p className='text-sm mt-1'>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className='bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm'>
            <p className='text-4xl mb-3'>📭</p>
            <p className='font-medium'>No shipments found</p>
            <p className='text-sm mt-1'>Create your first shipment to get started</p>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {filtered.map((s) => {
              const style =
                STATUS_OPTIONS.find((opt) => opt.value === s.status) ||
                STATUS_OPTIONS.find((opt) => opt.value === 'PENDING').value;
              const isUpdating = updating === s._id;

              return (
                <div
                  key={s._id}
                  className='flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow'>
                  {/* Left: Info */}
                  <div className='flex-1 min-w-0 mr-4'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='font-bold text-gray-900 text-sm'>{s.trackingId}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.badge}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 truncate'>
                      To: {s.recipient?.name} · {s.recipient?.address?.city}
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5'>
                      From: {s.sender?.name} · {s.sender?.address?.city}
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5'>
                      Created: {new Date(s.createdAt).toLocaleDateString('en-AU')}
                    </p>
                  </div>

                  {/* Right: Action */}
                  <div className='flex items-center gap-3'>
                    {/* Admin: Status Dropdown */}
                    {isAdmin && (
                      <div className='relative shrink-0'>
                        <select
                          value={s.status}
                          onChange={(e) => updateStatus(s._id, e.target.value)}
                          disabled={isUpdating}
                          className='border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer bg-white appearance-none
                                  focus:border-blue-400 pr-8'>
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        {isUpdating ? (
                          <Loading width={4} height={4} />
                        ) : (
                          <div className='absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs'>
                            ▾
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/track/${s.trackingId}`)}
                      className='shrink-0 text-blue-600 text-xs font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors'>
                      Track Package
                    </button>

                    {/* Admin Cancel Button */}
                    {/* DELETE /api/shipments/:id */}
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteModal({ id: s._id, trackingId: s.trackingId })}
                        disabled={s.status === 'DELIVERED'}
                        title={s.status === 'DELIVERED' ? 'Cannot delete a delivered shipment' : 'Delete shipment'}
                        className='flex items-center justify-center shrink-0 w-9 h-9
                                bg-red-50 hover:bg-red-100 text-red-500 rounded-lg disabled:opacity-40
                                disabled:cursor-not-allowed text-base'>
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cancel Confirmation Modal */}
      {deleteModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-8 text-center'>
            <div className='text-5xl mb-4'>⚠️</div>
            <h3 className='text-lg font-bold text-gray-900 mb-2'>Are you sure?</h3>
            <p className='text-sm text-gray-500 mb-1'>This will permanently cancel the shipment:</p>
            <p className='text-sm font-bold text-gray-800 mb-6'>{deleteModal.trackingId}</p>
            <p className='text-xs text-red-400 mb-6'>This action cannot be undone.</p>

            <div className='flex gap-3'>
              <button
                onClick={() => setDeleteModal(null)}
                disabled={deleting}
                className='flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50'>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className='flex items-center justify-center gap-2 flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50'>
                {deleting && (
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                )}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
