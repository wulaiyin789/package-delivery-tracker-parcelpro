const calculateCost = (parcel) => {
  const base = 9.99;
  const extra = (parcel?.weight || 1) * 2.5;
  const typeMultiplier = { standard: 1, express: 1.5, overnight: 2 };
  return parseFloat((base + extra) * (typeMultiplier[parcel?.type] || 1)).toFixed(2);
};

const calculateETA = (parcel) => {
  const days = { standard: 5, express: 2, overnight: 1 };
  const d = new Date();
  d.setDate(d.getDate() + (days[parcel?.type] || 5));
  return d;
};

export { calculateCost, calculateETA };
