const ConfirmModel = ({ modal, onConfirm, onCancel, loading }) => {
  if (!modal) return null;

  const config = {
    activate: {
      icon: '✅',
      title: 'Activate User?',
      message: `This will disable ${modal.user.name}'s account. They will be able to log in.`,
      confirm: 'Activate',
      btnClass: 'bg-green-500 hover:bg-green-600'
    },
    deactivate: {
      icon: '⚠️',
      title: 'Deactivate User?',
      message: `This will disable ${modal.user.name}'s account. They will not be able to log in.`,
      confirm: 'Deactivate',
      btnClass: 'bg-yellow-500 hover:bg-yellow-600'
    },
    delete: {
      icon: '🗑',
      title: 'Delete User?',
      message: `This will permanently delete ${modal.user.name} (${modal.user.email}). This cannot be undone.`,
      confirm: 'Delete',
      btnClass: 'bg-red-500 hover:bg-red-600'
    }
  }[modal.type];

  return (
    <div className='flex items-center justify-center fixed inset-0 bg-black/50 z-50 px-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm px-8 py-8 text-center'>
        <div className='text-5xl mb-4'>{config.icon}</div>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>{config.title}</h3>
        <p className='text-sm text-gray-500 mb-6'>{config.message}</p>
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50'>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 flex-1 py-2.5 text-white rounded-lg text-sm font-semibold disabled:opacity-50 ${config.btnClass}`}>
            {loading && (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
            )}
            {loading ? 'Processing...' : config.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModel;
