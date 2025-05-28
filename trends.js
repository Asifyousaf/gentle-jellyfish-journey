
// Simple trends page functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Trends page loaded');
  
  // Initialize the page
  loadMarketTrends();
  setupStockComparison();
  setupCryptoChart();
  setupStockSearch();
});

// Load market trends with simple mock data
function loadMarketTrends() {
  const marketTrendsContainer = document.getElementById('market-trends');
  if (!marketTrendsContainer) return;
  
  // Simple market data
  const marketData = [
    { name: 'S&P 500', symbol: 'SPY', price: 4185.50, change: 2.35, changePercent: 0.056 },
    { name: 'Dow Jones', symbol: 'DIA', price: 34123.88, change: -45.67, changePercent: -0.134 },
    { name: 'NASDAQ', symbol: 'QQQ', price: 14567.23, change: 12.45, changePercent: 0.085 }
  ];
  
  let html = '';
  marketData.forEach(item => {
    const isPositive = item.change >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const changeIcon = isPositive ? '▲' : '▼';
    
    html += `
      <div class="glass rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gold-400 mb-2">${item.name}</h3>
        <div class="text-2xl font-bold text-white mb-1">$${item.price.toFixed(2)}</div>
        <div class="${changeColor}">
          ${changeIcon} ${item.change.toFixed(2)} (${item.changePercent.toFixed(2)}%)
        </div>
      </div>
    `;
  });
  
  marketTrendsContainer.innerHTML = html;
}

// Setup stock comparison
function setupStockComparison() {
  const stockSelectors = document.querySelectorAll('.stock-selector');
  const chartCanvas = document.getElementById('stock-comparison-chart');
  
  if (!chartCanvas) return;
  
  // Simple chart placeholder
  const ctx = chartCanvas.getContext('2d');
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);
  ctx.fillStyle = '#000000';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Stock Comparison Chart', chartCanvas.width/2, chartCanvas.height/2);
  
  // Add click handlers to stock selectors
  stockSelectors.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      stockSelectors.forEach(btn => btn.classList.remove('bg-gold-500'));
      // Add active class to clicked button
      this.classList.add('bg-gold-500');
      
      showToast(`Selected ${this.dataset.symbol} for comparison`);
    });
  });
}

// Setup crypto chart
function setupCryptoChart() {
  const chartCanvas = document.getElementById('crypto-chart');
  const timeSelectors = document.querySelectorAll('.time-selector');
  
  if (!chartCanvas) return;
  
  // Simple chart placeholder
  const ctx = chartCanvas.getContext('2d');
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);
  ctx.fillStyle = '#000000';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Bitcoin Price Chart', chartCanvas.width/2, chartCanvas.height/2);
  
  // Add click handlers to time selectors
  timeSelectors.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      timeSelectors.forEach(btn => {
        btn.classList.remove('bg-gold-500/20');
        btn.classList.add('border-gold-500/30');
      });
      // Add active class to clicked button
      this.classList.add('bg-gold-500/20');
      
      showToast(`Updated chart for ${this.dataset.period} period`);
    });
  });
}

// Setup stock search
function setupStockSearch() {
  const searchForm = document.getElementById('stock-search-form');
  const searchInput = document.getElementById('stock-search-input');
  const resultsSection = document.getElementById('stock-lookup-section');
  const resultsContainer = document.getElementById('stock-results');
  
  if (!searchForm) return;
  
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const symbol = searchInput.value.trim().toUpperCase();
    if (!symbol) {
      showToast('Please enter a stock symbol', 'error');
      return;
    }
    
    // Simple mock stock data
    const mockData = {
      'AAPL': { name: 'Apple Inc.', price: 175.43, change: 2.15, volume: '45.2M' },
      'MSFT': { name: 'Microsoft Corporation', price: 378.85, change: -1.25, volume: '32.1M' },
      'GOOGL': { name: 'Alphabet Inc.', price: 2847.73, change: 15.42, volume: '28.7M' },
      'TSLA': { name: 'Tesla Inc.', price: 248.52, change: -8.75, volume: '89.3M' }
    };
    
    const stockData = mockData[symbol];
    
    if (stockData) {
      const isPositive = stockData.change >= 0;
      const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
      const changeIcon = isPositive ? '▲' : '▼';
      
      resultsContainer.innerHTML = `
        <div class="glass rounded-lg p-6">
          <h3 class="text-2xl font-semibold text-gold-400 mb-2">${symbol}</h3>
          <p class="text-gray-300 mb-4">${stockData.name}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-gray-400">Price</p>
              <p class="text-2xl font-bold text-white">$${stockData.price}</p>
            </div>
            <div>
              <p class="text-gray-400">Change</p>
              <p class="text-lg font-semibold ${changeColor}">
                ${changeIcon} $${Math.abs(stockData.change).toFixed(2)}
              </p>
            </div>
            <div>
              <p class="text-gray-400">Volume</p>
              <p class="text-lg text-white">${stockData.volume}</p>
            </div>
          </div>
        </div>
      `;
      
      resultsSection.classList.remove('hidden');
      showToast(`Found data for ${symbol}`);
    } else {
      showToast(`No data found for ${symbol}`, 'error');
    }
  });
}

// Simple toast notification function
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.className = `toast ${type === 'error' ? 'error' : 'success'}`;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
