
// Trends page functionality with real API data
const ALPHA_VANTAGE_API_KEY = 'DYC4OFYLHXPSJ777';

// Utility function to format currency
function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Show toast notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.className = `toast show ${type === 'error' ? 'error' : ''}`;
    
    setTimeout(() => {
      toast.className = 'toast';
    }, 3000);
  }
}

// Fetch stock data from Alpha Vantage
async function fetchStockData(symbol) {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day']
      };
    } else {
      throw new Error('Unable to fetch stock data');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

// Fetch time series data for charts
async function fetchStockTimeSeries(symbol, interval = 'daily') {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Time Series (Daily)']) {
      const timeSeriesData = data['Time Series (Daily)'];
      return Object.entries(timeSeriesData).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30); // Last 30 days
    } else {
      throw new Error('Unable to fetch time series data');
    }
  } catch (error) {
    console.error('Error fetching stock time series:', error);
    throw error;
  }
}

// Fetch crypto data
async function fetchCryptoData(symbol, market = 'USD') {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=${market}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    
    if (data['Time Series (Digital Currency Daily)']) {
      const timeSeries = data['Time Series (Digital Currency Daily)'];
      return Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values[`1a. open (${market})`]),
        high: parseFloat(values[`2a. high (${market})`]),
        low: parseFloat(values[`3a. low (${market})`]),
        close: parseFloat(values[`4a. close (${market})`]),
        volume: parseFloat(values['5. volume'])
      })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30); // Last 30 days
    } else {
      throw new Error('Unable to fetch crypto data');
    }
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
}

// Initialize market trends
async function initializeMarketTrends() {
  const marketTrendsElement = document.getElementById('market-trends');
  if (!marketTrendsElement) return;
  
  try {
    marketTrendsElement.innerHTML = '<div class="col-span-full text-center text-gold-400">Loading market trends...</div>';
    
    const indices = ['SPY', 'QQQ', 'DIA']; // ETFs representing major indices
    const promises = indices.map(symbol => fetchStockData(symbol));
    const results = await Promise.all(promises);
    
    let trendsHTML = '';
    results.forEach(stock => {
      if (stock) {
        const changeClass = stock.change >= 0 ? 'text-green-400' : 'text-red-500';
        const changeIcon = stock.change >= 0 ? '↗' : '↘';
        
        trendsHTML += `
          <div class="glass glass-hover rounded-lg p-6">
            <h3 class="text-xl font-semibold text-gold-400 mb-2">${stock.symbol}</h3>
            <div class="text-3xl font-bold mb-2">${formatCurrency(stock.price)}</div>
            <div class="flex items-center ${changeClass}">
              <span class="text-lg">${changeIcon}</span>
              <span class="ml-2">${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)</span>
            </div>
            <div class="text-sm text-gray-400 mt-2">${stock.latestTradingDay}</div>
          </div>
        `;
      }
    });
    
    marketTrendsElement.innerHTML = trendsHTML;
  } catch (error) {
    console.error('Error initializing market trends:', error);
    marketTrendsElement.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load market trends</div>';
  }
}

// Stock comparison chart
let stockComparisonChart = null;

async function initializeStockComparison() {
  const canvas = document.getElementById('stock-comparison-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Initialize with AAPL data
  await updateStockChart('AAPL');
  
  // Add event listeners to stock selector buttons
  const stockSelectors = document.querySelectorAll('.stock-selector');
  stockSelectors.forEach(button => {
    button.addEventListener('click', async function() {
      // Remove active class from all buttons
      stockSelectors.forEach(btn => {
        btn.classList.remove('bg-gold-500', 'text-black');
        btn.classList.add('bg-gold-500/20', 'text-gold-400');
      });
      
      // Add active class to clicked button
      this.classList.remove('bg-gold-500/20', 'text-gold-400');
      this.classList.add('bg-gold-500', 'text-black');
      
      const symbol = this.dataset.symbol;
      await updateStockChart(symbol);
    });
  });
}

async function updateStockChart(symbol) {
  try {
    const timeSeriesData = await fetchStockTimeSeries(symbol);
    
    const labels = timeSeriesData.map(item => item.date);
    const prices = timeSeriesData.map(item => item.close);
    
    if (stockComparisonChart) {
      stockComparisonChart.destroy();
    }
    
    const canvas = document.getElementById('stock-comparison-chart');
    const ctx = canvas.getContext('2d');
    
    stockComparisonChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Closing Price`,
          data: prices,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${symbol} - 30 Day Price Trend`,
            color: '#f59e0b'
          },
          legend: {
            labels: {
              color: '#f59e0b'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#9ca3af'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          },
          y: {
            ticks: {
              color: '#9ca3af',
              callback: function(value) {
                return '$' + value.toFixed(2);
              }
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating stock chart:', error);
    showToast('Failed to load stock chart data', 'error');
  }
}

// Crypto chart
let cryptoChart = null;

async function initializeCryptoChart() {
  const canvas = document.getElementById('crypto-chart');
  if (!canvas) return;
  
  await updateCryptoChart('BTC');
  
  // Add event listeners to time selector buttons
  const timeSelectors = document.querySelectorAll('.time-selector');
  timeSelectors.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      timeSelectors.forEach(btn => {
        btn.classList.remove('bg-gold-500', 'text-black');
        btn.classList.add('bg-gold-500/20', 'text-gold-400');
      });
      
      // Add active class to clicked button
      this.classList.remove('bg-gold-500/20', 'text-gold-400');
      this.classList.add('bg-gold-500', 'text-black');
      
      // For now, we'll just refresh with the same data
      // In a real implementation, you'd fetch different time periods
      updateCryptoChart('BTC');
    });
  });
}

async function updateCryptoChart(symbol) {
  try {
    const timeSeriesData = await fetchCryptoData(symbol);
    
    const labels = timeSeriesData.map(item => item.date);
    const prices = timeSeriesData.map(item => item.close);
    
    if (cryptoChart) {
      cryptoChart.destroy();
    }
    
    const canvas = document.getElementById('crypto-chart');
    const ctx = canvas.getContext('2d');
    
    cryptoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${symbol} Price (USD)`,
          data: prices,
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${symbol} - 30 Day Price Trend`,
            color: '#00ff88'
          },
          legend: {
            labels: {
              color: '#00ff88'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#9ca3af'
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          },
          y: {
            ticks: {
              color: '#9ca3af',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            },
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error updating crypto chart:', error);
    showToast('Failed to load crypto chart data', 'error');
  }
}

// Stock lookup functionality
function initializeStockLookup() {
  const form = document.getElementById('stock-search-form');
  const input = document.getElementById('stock-search-input');
  const resultsSection = document.getElementById('stock-lookup-section');
  const resultsContainer = document.getElementById('stock-results');
  
  if (form && input) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const symbol = input.value.trim().toUpperCase();
      
      if (!symbol) {
        showToast('Please enter a stock symbol', 'error');
        return;
      }
      
      try {
        resultsContainer.innerHTML = '<div class="text-center text-gold-400">Loading stock data...</div>';
        resultsSection.classList.remove('hidden');
        
        const stockData = await fetchStockData(symbol);
        const timeSeriesData = await fetchStockTimeSeries(symbol);
        
        const changeClass = stockData.change >= 0 ? 'text-green-400' : 'text-red-500';
        const changeIcon = stockData.change >= 0 ? '↗' : '↘';
        
        resultsContainer.innerHTML = `
          <div class="glass rounded-lg p-6">
            <div class="flex flex-col md:flex-row justify-between items-start mb-6">
              <div>
                <h3 class="text-3xl font-bold text-gold-400 mb-2">${stockData.symbol}</h3>
                <div class="text-4xl font-bold mb-2">${formatCurrency(stockData.price)}</div>
                <div class="flex items-center ${changeClass} text-lg">
                  <span>${changeIcon}</span>
                  <span class="ml-2">${stockData.change.toFixed(2)} (${stockData.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
              <div class="text-right mt-4 md:mt-0">
                <div class="text-sm text-gray-400">Volume</div>
                <div class="text-xl font-semibold">${stockData.volume.toLocaleString()}</div>
                <div class="text-sm text-gray-400 mt-2">Last Trading Day</div>
                <div class="text-lg">${stockData.latestTradingDay}</div>
              </div>
            </div>
            
            <div class="h-[300px]">
              <canvas id="stock-lookup-chart"></canvas>
            </div>
          </div>
        `;
        
        // Create chart for the looked up stock
        setTimeout(() => {
          const canvas = document.getElementById('stock-lookup-chart');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const labels = timeSeriesData.map(item => item.date);
            const prices = timeSeriesData.map(item => item.close);
            
            new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: `${symbol} Closing Price`,
                  data: prices,
                  borderColor: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.1
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: `${symbol} - 30 Day Price History`,
                    color: '#f59e0b'
                  },
                  legend: {
                    labels: {
                      color: '#f59e0b'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#9ca3af'
                    },
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#9ca3af',
                      callback: function(value) {
                        return '$' + value.toFixed(2);
                      }
                    },
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    }
                  }
                }
              }
            });
          }
        }, 100);
        
        showToast(`Stock data loaded for ${symbol}!`);
        
      } catch (error) {
        console.error('Error fetching stock lookup data:', error);
        resultsContainer.innerHTML = '<div class="text-center text-red-500">Failed to load stock data. Please check the symbol and try again.</div>';
        showToast('Failed to load stock data', 'error');
      }
    });
  }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async function() {
  // Load Chart.js if not already loaded
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = async function() {
      await initializeMarketTrends();
      await initializeStockComparison();
      await initializeCryptoChart();
      initializeStockLookup();
    };
    document.head.appendChild(script);
  } else {
    await initializeMarketTrends();
    await initializeStockComparison();
    await initializeCryptoChart();
    initializeStockLookup();
  }
});
