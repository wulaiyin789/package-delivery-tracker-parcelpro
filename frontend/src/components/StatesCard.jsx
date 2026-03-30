const StatesCard = ({ label, value, valueClass = 'text-gray-900' }) => (
  <div className='bg-white rounded-xl px-5 py-4 flex-1 min-w-[100px] shadow-sm'>
    <p className='text-xs text-gray-400 mb-1'>{label}</p>
    <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
  </div>
);

export default StatesCard;
