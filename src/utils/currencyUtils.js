// Exchange rates (₹ as base, precise and reciprocal)
const exchangeRates = {
  '₹': {
    '$': 0.012000,
    '€': 0.011111,
    '£': 0.009524
  },
  '$': {
    '₹': 83.333333,
    '€': 0.925926,
    '£': 0.793651
  },
  '€': {
    '₹': 90.000000,
    '$': 1.080000,
    '£': 0.857143
  },
  '£': {
    '₹': 105.000000,
    '$': 1.260000,
    '€': 1.166667
  }
};

// Convert amount, always using ₹ as base
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return Number(amount.toFixed(2));
  
  // To ₹ (base)
  const inINR = fromCurrency === '₹' ? amount : amount * exchangeRates[fromCurrency]['₹'];
  
  // From ₹ to target
  const result = toCurrency === '₹' ? inINR : inINR * exchangeRates['₹'][toCurrency];
  return Number(result.toFixed(2));
};

// Format with currency symbol
export const formatCurrency = (amount, currency) => {
  return `${currency}${amount.toFixed(2)}`;
};

// Transaction class: Immutable ₹ base
class Transaction {
  constructor(amount, inputCurrency) {
    this.baseAmount = inputCurrency === '₹' ? amount : convertCurrency(amount, inputCurrency, '₹');
    this.baseCurrency = '₹';
  }

  getDisplayAmount(targetCurrency) {
    return convertCurrency(this.baseAmount, this.baseCurrency, targetCurrency);
  }
}

// Demo with strict base enforcement
let transactions = [
  new Transaction(8350, '₹'),  // 8350 ₹
  new Transaction(100, '$')    // 100 $ = 8333.33 ₹
];
let displayCurrency = '₹';

function switchCurrency(newCurrency) {
  displayCurrency = newCurrency;
  transactions.forEach((t, index) => {
    const displayAmount = t.getDisplayAmount(displayCurrency);
    console.log(`T${index + 1}: ${formatCurrency(displayAmount, displayCurrency)}`);
  });
}

// Test
console.log("Initial (INR):");
switchCurrency('₹');  // T1: ₹8350.00, T2: ₹8333.33
console.log("To USD:");
switchCurrency('$');  // T1: $100.20, T2: $100.00
console.log("Back to INR:");
switchCurrency('₹');  // T1: ₹8350.00, T2: ₹8333.33
console.log("To USD again:");
switchCurrency('$');  // T1: $100.20, T2: $100.00
console.log("To EUR:");
switchCurrency('€');  // T1: €92.72, T2: €92.59
console.log("Back to INR again:");
switchCurrency('₹');  // T1: ₹8350.00, T2: ₹8333.33
