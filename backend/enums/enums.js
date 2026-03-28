// Status label map
const statusLabel = {
  pending: 'Order Received',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

// Shipping rates and ETA
const shippingRates = {
  'STANDARD': { costPerKg: 2.5, baseCost: 9.99, days: 5, label: 'Standard Delivery' },
  'EXPRESS': { costPerKg: 4.0, baseCost: 14.99, days: 2, label: 'Express Delivery' },
  'OVERNIGHT': { costPerKg: 6.0, baseCost: 24.99, days: 1, label: 'Overnight Delivery' }
};

export { statusLabel, shippingRates };
