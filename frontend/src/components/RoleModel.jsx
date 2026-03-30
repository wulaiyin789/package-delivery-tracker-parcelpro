import { useState } from 'react';

const ROLES = ['CUSTOMER', 'COURIER', 'ADMIN'];

const RoleModal = ({ modal, onConfirm, onCancel, loading }) => {
  const [selectedRole, setSelectedRole] = useState(modal?.user?.role || 'CUSTOMER');

  if (!modal) return null;

  return (
    <div className='flex items-center justify-center fixed inset-0 bg-black/50 z-50 px-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-8'>
        <h3 className='text-lg font-bold text-gray-900 text-center mb-1'>Change Role</h3>
        <p className='text-sm text-gray-500 text-center mb-6'>
          Updating role for <span className='font-semibold text-gray-800'>{modal.user.name}</span>
        </p>

        {/* Role selector */}
        <div className='flex flex-col gap-2 mb-6'>
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all
                          ${
                            selectedRole === role
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}>
              <span className='capitalize'>{role.toLowerCase()}</span>
              {selectedRole === role && <span>✓</span>}
            </button>
          ))}
        </div>

        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50'>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedRole)}
            disabled={loading || selectedRole === modal.user.role}
            className='flex items-center justify-center gap-2 flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50'>
            {loading && (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            )}
            {loading ? 'Saving...' : 'Save Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
