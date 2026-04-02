import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth
import { useAuth } from '../context/AuthContext';

// Constants
import { INITIAL_FORM, SHIPPING_OPTIONS, STEPS } from '../helper/constants';

// Config
import axiosInstance from '../axiosConfig';

// Components
import InputField from '../components/InputField';
import Loading from '../components/Loading';
import Header from '../components/Header';

const inputClass = `w-full border border-gray-200 focus:border-blue-500 rounded-lg px-3 py-2.5 text-sm outline-none bg-white`;

// PDT-51, PDT-53, PDT-54
const CreateShipment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (step === 0) {
      if (!formData.receiverName || !formData.deliveryAddress || !formData.receiverPhone)
        return 'All receiver fields are required';
    }
    if (step === 1) {
      if (!formData.weight || !formData.length || !formData.width || !formData.height)
        return 'All dimension fields are required';
      if (parseFloat(formData.weight) <= 0) return 'Weight must be greater than 0';
    }
    return null;
  };

  const nextStep = () => {
    const err = validate();
    if (err) return setError(err);
    setError('');
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/api/shipments', {
        sender: {
          name: user?.name || 'Self',
          phone: user?.phone,
          address: {
            street: '123 Brisbane Street',
            city: 'Brisbane',
            state: 'QLD',
            postcode: '4000'
          }
        },
        recipient: {
          name: formData.receiverName,
          phone: formData.receiverPhone,
          address: {
            street: formData.deliveryAddress,
            city: '',
            state: '',
            postcode: ''
          }
        },
        parcel: {
          weight: parseFloat(formData.weight),
          dimensions: `${formData.length}x${formData.width}x${formData.height} cm`,
          description: formData.description,
          type: formData.shippingType
        }
      });
      navigate(`/track/${data.data.trackingId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='flex items-center gap-3 w-full px-6 py-4 shadow-sm pl-20'>
        <button
          onClick={() => (step === 0 ? navigate('/dashboard') : setStep((s) => s - 1))}
          className='text-gray-500 hover:text-gray-800 transition-colors text-lg'>
          ←
        </button>
        <div className='w-full'>
          <Header title={'Create Shipment'} user={user} />
        </div>
      </header>

      <main className='flex justify-center flex-1 p-6'>
        <div className='w-full max-w-2xl'>
          {/* Step Indicator */}
          <div className='flex items-center mb-8'>
            {STEPS.map((label, i) => (
              <div key={i} className='flex items-center flex-1 last:flex-none'>
                {/* Circle + Label */}
                <div className='flex flex-col items-center'>
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-colors duration-200
                              ${
                                i < step
                                  ? 'bg-blue-600 text-white'
                                  : i === step
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                    : 'bg-gray-200 text-gray-400'
                              }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span
                    className={`text-xs mt-1.5 font-semibold whitespace-nowrap
                                  ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 mb-5 transition-colors duration-200 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className='bg-white rounded-2xl shadow-sm p-7'>
            {/* STEP 1 – Receiver Details */}
            {step === 0 && (
              <>
                <h3 className='text-base font-bold text-gray-900 mb-5'>Receiver Information</h3>
                <InputField label='Receiver Name' required>
                  <input
                    name='receiverName'
                    placeholder='John Smith'
                    value={formData.receiverName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </InputField>
                <InputField label='Delivery Address' required>
                  <textarea
                    name='deliveryAddress'
                    placeholder='123 Brisbane City, QLD 4000'
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </InputField>
                <InputField label='Receiver Phone No.' required>
                  <input
                    name='receiverPhone'
                    placeholder='+61 4XX XXX XXX'
                    value={formData.receiverPhone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </InputField>
              </>
            )}

            {/* STEP 2 – Package Details */}
            {step === 1 && (
              <>
                <h3 className='text-base font-bold text-gray-900 mb-5'>Package Details</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <InputField label='Weight (kg)' required>
                    <input
                      name='weight'
                      type='number'
                      min='0.1'
                      placeholder='0.0'
                      value={formData.weight}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>
                  <InputField label='Length (cm)' required>
                    <input
                      name='length'
                      type='number'
                      min='1'
                      placeholder='0'
                      value={formData.length}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>
                  <InputField label='Width (cm)' required>
                    <input
                      name='width'
                      type='number'
                      min='1'
                      placeholder='0'
                      value={formData.width}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>
                  <InputField label='Height (cm)' required>
                    <input
                      name='height'
                      type='number'
                      min='1'
                      placeholder='0'
                      value={formData.height}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </InputField>
                </div>
                <InputField label='Package Description'>
                  <textarea
                    name='description'
                    placeholder='Books, electronics, etc...'
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </InputField>
              </>
            )}

            {/* STEP 3 – Shipping Option */}
            {step === 2 && (
              <>
                <h3 className='text-base font-bold text-gray-900 mb-5'>Choose Shipment Option</h3>
                <div className='flex flex-col gap-3'>
                  {SHIPPING_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      type='button'
                      onClick={() => setFormData({ ...formData, shippingType: opt.type })}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl 
                                border-2 text-left transition-all duration-150 w-full
                                ${
                                  formData.shippingType === opt.type
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}>
                      <div className='flex items-center gap-4'>
                        <span className='text-2xl'>{opt.icon}</span>
                        <div>
                          <p
                            className={`font-semibold text-sm ${formData.shippingType === opt.type ? 'text-blue-700' : 'text-gray-800'}`}>
                            {opt.label}
                          </p>
                          <p className='text-xs text-gray-400 mt-0.5'>{opt.sub}</p>
                        </div>
                      </div>
                      <span
                        className={`font-bold text-base ${formData.shippingType === opt.type ? 'text-blue-700' : 'text-gray-700'}`}>
                        {opt.price}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <div className='mt-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2'>
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-100'>
              <button
                onClick={() => (step === 0 ? navigate('/dashboard') : setStep((s) => s - 1))}
                className='px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors'>
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  onClick={nextStep}
                  className='px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors'>
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className='px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2'>
                  {loading && <Loading />}
                  {loading ? 'Creating...' : 'Create Shipment'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateShipment;
