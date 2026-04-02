const Loading = ({ width, height }) => {
  return (
    <div className='flex justify-center py-16'>
      <div className={`w-${width || '8'} h-${height || '8'} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default Loading;
