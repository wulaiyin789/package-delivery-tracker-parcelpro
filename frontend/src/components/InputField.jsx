const InputField = ({ label, required, children }) => (
  <div className='mb-4'>
    <label className='block text-sm font-medium text-gray-700 mb-1'>
      {label}
      {required && <span className='text-red-500 ml-0.5'>*</span>}
    </label>
    {children}
  </div>
);

export default InputField;