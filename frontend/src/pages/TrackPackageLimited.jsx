import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Config
import axiosInstance from '../axiosConfig';

// Constants
import { STATUS_BADGE, STATUS_OPTIONS } from '../helper/constants';

const META_ITEMS = (info) => [
  { label: 'Weight', value: info?.parcel?.weight || 'N/A' },
  { label: 'Dimensions', value: info?.parcel?.dimensions || 'N/A' },
  { label: 'Courier', value: info.courier?.name || 'Not assigned' },
  {
    label: 'Created At',
    value: info?.createdAt ? new Date(info.createdAt).toDateString() : 'N/A'
  }
];

const TrackPackage = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();

  // States
  const [info, setInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // GET /api/tracking/:trackingId
        const { data: statusData } = await axiosInstance.get(`/api/tracking/${trackingId}`);
        setInfo(statusData.data);

        // GET /api/tracking/:trackingId/history
        const { data: histData } = await axiosInstance.get(`/api/tracking/${trackingId}/history`);
        setHistory(histData.data.timeline);
      } catch (err) {
        setError(err.response?.data?.message || 'Tracking ID not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [trackingId]);

  // Loading ──
  if (loading)
    return (
      <div className='flex min-h-screen bg-gray-100'>
        <main className='flex items-center justify-center ml-16 flex-1 '>
          <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
        </main>
      </div>
    );

  // Error ──
  if (error)
    return (
      <div className='flex min-h-screen bg-gray-100'>
        <main className='flex flex-col items-center justify-center gap-4 flex-1 ml-16 '>
          <p className='text-5xl'>📭</p>
          <p className='text-gray-700 font-semibold'>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold'>
            ← Go Back
          </button>
        </main>
      </div>
    );

  // Reversed so latest event is at top of timeline
  const reversedHistory = [...history].reverse();
  const badgeClass = STATUS_BADGE[info.status] || STATUS_BADGE.PENDING;

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <main className='ml-16 flex-1 p-6'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <button onClick={() => navigate('/dashboard')} className='text-gray-500 hover:text-gray-800 text-lg'>
            ←
          </button>
        </div>

        {/* Package Summary Card */}
        <div className='bg-white rounded-2xl shadow-sm p-6 mb-4'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-xl font-extrabold text-gray-900 mb-2'>{info.trackingId}</h3>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
                {STATUS_OPTIONS.find((opt) => opt.value === info.status)?.label || info.status}
              </span>
            </div>
            <div className='text-right'>
              <p className='text-xs text-gray-400 mb-0.5'>Expected Delivery</p>
              <p className='text-sm font-bold text-gray-800'>
                {info.estimatedDelivery ? new Date(info.estimatedDelivery).toDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <hr className='border-gray-100 mb-4' />

          {/* Meta row */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {META_ITEMS(info).map(({ label, value }) => (
              <div key={label}>
                <p className='text-xs text-gray-400 mb-0.5'>{label}</p>
                <p className='text-sm font-semibold text-gray-800'>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className='bg-white rounded-2xl shadow-sm p-6 mb-4'>
          <h3 className='text-base font-bold text-gray-900 mb-6'>Tracking Timeline</h3>

          {reversedHistory.length === 0 ? (
            <p className='text-sm text-gray-400'>No tracking events yet.</p>
          ) : (
            <div className='flex flex-col'>
              {reversedHistory.map((event, i) => {
                const isLatest = i === 0;
                return (
                  <div key={i} className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 border-2
                                    ${
                                      isLatest
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                        {isLatest ? '✓' : ''}
                      </div>
                      {i < reversedHistory.length - 1 && <div className='w-0.5 flex-1 bg-gray-200 my-1' />}
                    </div>

                    {/* Content */}
                    <div className='pb-6 flex-1'>
                      <p className={`text-sm font-bold mb-0.5 ${isLatest ? 'text-gray-900' : 'text-gray-400'}`}>
                        {STATUS_OPTIONS.find((opt) => opt.value === event.status)?.label || event.status}
                      </p>
                      <p className={`text-xs mb-1 ${isLatest ? 'text-gray-600' : 'text-gray-400'}`}>
                        {event.description}
                      </p>
                      {(event.location || event.timestamp) && (
                        <p className='text-xs text-gray-400 flex items-center gap-3'>
                          {event.location && <span>📍 {event.location}</span>}
                          {event.timestamp && <span>🕐 {new Date(event.timestamp).toDateString()}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrackPackage;
