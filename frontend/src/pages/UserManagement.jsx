import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

// Auth
import { useAuth } from '../context/AuthContext';

// Helpers
import useDebounce from '../hooks/useDebounce';

// Config
import axiosInstance from '../axiosConfig';

// Components
import Header from '../components/Header';
import StatesCard from '../components/StatesCard';
import ConfirmModel from '../components/ConfirmModel';
import RoleModal from '../components/RoleModel';

const ROLE_FILTER = ['ALL', 'CUSTOMER', 'COURIER', 'ADMIN'];
const LIMIT = 10;

const ROLE_STYLES = {
  ADMIN: 'bg-violet-100 text-violet-700',
  COURIER: 'bg-blue-100 text-blue-700',
  CUSTOMER: 'bg-gray-100 text-gray-600'
};

const STATUS_STYLES = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-red-100 text-red-500'
};

// PDT-72, PDT-76
const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admins immediately
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // States
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [toast, setToast] = useState('');

  // Debounce search input to avoid excessive API calls
  const debouncedSearch = useDebounce(search, 400);

  // Show toast briefly
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // GET /api/users/search?q=&role=&page=&limit=
  const fetchUsers = useCallback(async (q, role, pg) => {
    if (pg === 1 && q === '') {
      setLoading(true);
    } else {
      setSearching(true);
    }

    try {
      const params = { page: pg, limit: LIMIT };

      if (q) params.q = q;
      if (role !== 'ALL') params.role = role;

      const { data } = await axiosInstance.get('/api/users/search', { params });

      setUsers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers('', 'ALL', 1);
  }, [fetchUsers]);

  // Refetch on search/filter/page change
  useEffect(() => {
    fetchUsers(debouncedSearch, roleFilter);
  }, [debouncedSearch, roleFilter, fetchUsers]);

  // Reset to page 1 when filter changes
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
  };

  const handleSearch = (val) => {
    setSearch(val);
  };

  // PUT /api/users/deactivate/:id  (deactivate — soft delete) OR
  // PUT /api/users/activate/:id (activate)
  const handleActivateOrDeactivate = async (value) => {
    setActionLoading(true);
    try {
      if (value === 'ACTIVE') {
        const { data } = await axiosInstance.put(`/api/users/activate/${confirmModal.user._id}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === confirmModal.user._id ? { ...u, status: data?.user?.status } : u))
        );
        showToast(data.message);
      } else {
        const { data } = await axiosInstance.put(`/api/users/deactivate/${confirmModal.user._id}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === confirmModal.user._id ? { ...u, status: data?.user?.status } : u))
        );
        showToast(data.message);
      }
      setConfirmModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE /api/users/:id  (hard delete)
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/api/users/${confirmModal.user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== confirmModal.user._id));
      showToast(data.message);
      setConfirmModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  // PUT /api/users/:id/role
  const handleRoleUpdate = async (newRole) => {
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.put(`/api/users/${roleModal.user._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === roleModal.user._id ? { ...u, role: newRole } : u)));
      showToast(data.message);
      setRoleModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = {
    active: users.filter((u) => u.status).length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    customers: users.filter((u) => u.role === 'CUSTOMER').length,
    couriers: users.filter((u) => u.role === 'COURIER').length
  };

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <main className='ml-16 flex-1 p-6'>
        {/* Header */}
        <div className='mb-6'>
          <Header title='User Management' user={user} />
        </div>

        {/* Stat Cards */}
        <div className='flex gap-4 mb-6 flex-wrap'>
          <StatesCard label='Admins' value={stats.admins} valueClass='text-violet-600' />
          <StatesCard label='Couriers' value={stats.couriers} valueClass='text-blue-600' />
          <StatesCard label='Customers' value={stats.customers} valueClass='text-green-600' />
          <StatesCard label='Active' value={stats.active} valueClass='text-red-500' />
        </div>

        {/* Search + Role Filter */}
        <div className='flex gap-3 mb-4 flex-wrap items-center'>
          {/* Search */}
          <div className='relative flex-1 min-w-[200px]'>
            <input
              type='text'
              className='w-full bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none focus:border-blue-400'
              placeholder='Search by name, email or phone'
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searching && (
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
              </div>
            )}
            {search && !searching && (
              <button
                onClick={() => handleSearch('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg'>
                ×
              </button>
            )}
          </div>

          {/* Role filter pills */}
          <div className='flex gap-2'>
            {ROLE_FILTER.map((r) => (
              <button
                key={r}
                onClick={() => handleRoleFilter(r)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold
                            ${
                              roleFilter === r
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                            }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* //TODO Add User Creation Feature */}

        {/* Table */}
        {loading ? (
          <div className='flex justify-center py-16'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : users.length === 0 ? (
          <div className='bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm'>
            <p className='font-medium'>No users found</p>
          </div>
        ) : (
          <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gray-50 border-b border-gray-100'>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500'>User</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500'>Phone</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500'>Role</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500'>Status</th>
                  <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500'>Joined</th>
                  <th className='text-right px-5 py-3 text-xs font-semibold text-gray-500'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {users.map((u) => {
                  const isSelf = u._id === user?._id;
                  const isAdminUser = u.role === 'ADMIN';
                  const isProtected = isSelf || isAdminUser;

                  return (
                    <tr key={u._id} className={`hover:bg-gray-50 ${!u.status ? 'opacity-60' : ''}`}>
                      {/* User info */}
                      <td className='px-5 py-3.5'>
                        <div className='flex items-center gap-3'>
                          <div className='min-w-0'>
                            <p className='font-semibold text-gray-900 truncate'>
                              {u.name}
                              {isSelf && <span className='ml-1.5 text-xs font-normal text-gray-400'>(you)</span>}
                            </p>
                            <p className='text-xs text-gray-400 truncate'>{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className='px-5 py-3.5 text-xs text-gray-500'>{u.phone || '—'}</td>

                      {/* Role badge */}
                      <td className='px-5 py-3.5'>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ROLE_STYLES[u.role] || ROLE_STYLES.CUSTOMER}`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Active status */}
                      <td className='px-5 py-3.5'>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[u.status]}`}>
                          {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Joined date */}
                      <td className='px-5 py-3.5 text-xs text-gray-400'>
                        {new Date(u.createdAt).toLocaleDateString('en-AU')}
                      </td>

                      {/* Actions */}
                      <td className='px-5 py-3.5'>
                        <div className='flex items-center justify-end gap-2'>
                          {/* Change Role */}
                          <button
                            onClick={() => setRoleModal({ user: u })}
                            disabled={isProtected}
                            title={
                              isSelf
                                ? 'Cannot change your own role'
                                : isAdminUser
                                  ? 'Cannot change admin role'
                                  : 'Change role'
                            }
                            className='px-3 py-1.5 text-xs font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'>
                            Role
                          </button>

                          {/* Deactivate */}
                          {u.status !== 'ACTIVE' ? (
                            <button
                              onClick={() => setConfirmModal({ type: 'activate', user: u })}
                              disabled={isProtected || !u.status}
                              title={
                                isSelf
                                  ? 'Cannot activate yourself'
                                  : isAdminUser
                                    ? 'Cannot activate admin'
                                    : !u.status
                                      ? 'Already active'
                                      : 'Activate user'
                              }
                              className='px-3 py-1.5 text-xs font-semibold border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'>
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmModal({ type: 'deactivate', user: u })}
                              disabled={isProtected || !u.status}
                              title={
                                isSelf
                                  ? 'Cannot deactivate yourself'
                                  : isAdminUser
                                    ? 'Cannot deactivate admin'
                                    : !u.status
                                      ? 'Already inactive'
                                      : 'Deactivate user'
                              }
                              className='px-3 py-1.5 text-xs font-semibold border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'>
                              Deactivate
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setConfirmModal({ type: 'delete', user: u })}
                            disabled={isProtected}
                            title={
                              isSelf ? 'Cannot delete yourself' : isAdminUser ? 'Cannot delete admin' : 'Delete user'
                            }
                            className='flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed text-base'>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {/* //TODO Future feature */}
      </main>

      {/* Modals */}
      <ConfirmModel
        modal={confirmModal}
        loading={actionLoading}
        onCancel={() => setConfirmModal(null)}
        onConfirm={() => {
          if (confirmModal?.type === 'delete') {
            handleDelete();
          } else {
            handleActivateOrDeactivate(confirmModal?.user?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
          }
        }}
      />

      <RoleModal
        modal={roleModal}
        loading={actionLoading}
        onCancel={() => setRoleModal(null)}
        onConfirm={handleRoleUpdate}
      />

      {/* Toast Notification */}
      {toast && (
        <div className='fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl animate-fade-in'>
          {toast}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
