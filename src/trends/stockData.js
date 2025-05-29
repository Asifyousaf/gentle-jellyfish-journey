
// Stock data utilities
export function generateMockStockData(symbol, days = 30) {
  const data = [];
  const basePrice = Math.random() * 200 + 50;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const price = basePrice + (Math.random() - 0.5) * 20;
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, 10)
    });
  }
  
  return data;
}

export function generateMarketIndexData() {
  return {
    'S&P 500': { value: 4500 + Math.random() * 200, change: (Math.random() - 0.5) * 2 },
    'NASDAQ': { value: 14000 + Math.random() * 1000, change: (Math.random() - 0.5) * 3 },
    'DOW': { value: 34000 + Math.random() * 2000, change: (Math.random() - 0.5) * 2 }
  };
}

export function generateCryptoData(period = '1m') {
  const periods = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
    '5y': 1825
  };
  
  const days = periods[period] || 30;
  return generateMockStockData('BTC', days);
}
