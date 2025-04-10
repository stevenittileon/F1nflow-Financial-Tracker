// Exchange rates (as of current date - these should be updated regularly)
const exchangeRates = {
  '₹': {
    '$': 0.012,
    '€': 0.011,
    '£': 0.0095
  },
  '$': {
    '₹': 83.5,
    '€': 0.92,
    '£': 0.79
  },
  '€': {
    '₹': 90.5,
    '$': 1.09,
    '£': 0.86
  },
  '£': {
    '₹': 105.5,
    '$': 1.26,
    '€': 1.16
  }
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first if not already USD
  let inUSD = amount;
  if (fromCurrency !== '$') {
    inUSD = amount * exchangeRates[fromCurrency]['$'];
  }
  
  // Convert from USD to target currency
  if (toCurrency === '$') return inUSD;
  return inUSD * exchangeRates['$'][toCurrency];
};

export const formatCurrency = (amount, currency) => {
  return `${currency}${amount.toFixed(2)}`;
}; 