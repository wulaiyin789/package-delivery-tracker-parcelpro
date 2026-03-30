const STEPS = ['Receiver Details', 'Package Details', 'Shipping Option'];

const SHIPPING_OPTIONS = [
  {
    type: 'STANDARD',
    label: 'Standard Delivery',
    sub: '5 Business days',
    price: '$9.99',
    icon: '📦'
  },
  {
    type: 'EXPRESS',
    label: 'Express Delivery',
    sub: '2 Business days',
    price: '$14.99',
    icon: '🚚'
  },
  {
    type: 'OVERNIGHT',
    label: 'Overnight Delivery',
    sub: 'Next Business day',
    price: '$24.99',
    icon: '⚡'
  }
];

const INITIAL_FORM = {
  receiverName: '',
  deliveryAddress: '',
  receiverPhone: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  description: '',
  shippingType: 'standard'
};

const STATUS_BADGE = {
  PENDING: 'bg-gray-100 text-gray-500',
  PICKED_UP: 'bg-blue-100 text-blue-700',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
  OUT_OF_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600'
};

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', badge: 'bg-gray-100 text-gray-500' },
  { value: 'PICKED_UP', label: 'Picked Up', badge: 'bg-blue-100 text-blue-700' },
  { value: 'IN_TRANSIT', label: 'In Transit', badge: 'bg-yellow-100 text-yellow-700' },
  { value: 'OUT_OF_DELIVERY', label: 'Out for Delivery', badge: 'bg-purple-100 text-purple-700' },
  { value: 'DELIVERED', label: 'Delivered', badge: 'bg-green-100 text-green-700' },
  { value: 'CANCELLED', label: 'Cancelled', badge: 'bg-red-100 text-red-600' }
];

export { STEPS, SHIPPING_OPTIONS, INITIAL_FORM, STATUS_BADGE, STATUS_OPTIONS };
