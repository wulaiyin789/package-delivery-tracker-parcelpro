// Status label map
const statusLabel = {
  PENDING: 'Pending',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  OUT_OF_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

// Shipping rates and ETA
const shippingRates = {
  'STANDARD': { costPerKg: 2.5, baseCost: 9.99, days: 5, label: 'Standard Delivery' },
  'EXPRESS': { costPerKg: 4.0, baseCost: 14.99, days: 2, label: 'Express Delivery' },
  'OVERNIGHT': { costPerKg: 6.0, baseCost: 24.99, days: 1, label: 'Overnight Delivery' }
};

export { statusLabel, shippingRates };
