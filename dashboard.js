
import { 
  fetchStockData,
  getMarketIndices,
  getMajorStocks,
  getMajorCrypto
} from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
  // Initialize dashboard elements with real data
  await initializeMarketOverview();
  await initializeWatchlist();
  await initializeCryptoTracker();
  updateDateTime();
  
  // Set up refresh button
  const refreshBtn = document.getElementById('refresh-dashboard');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async function() {
      this.classList.add('animate-spin');
      await refreshDashboardData();
      setTimeout(() => {
        this.classList.remove('animate-spin');
        showToast('Dashboard data refreshed successfully!');
      }, 1000);
    });
  }
});

// Update date and time
function updateDateTime() {
  const dateTimeElement = document.getElementById('current-datetime');
  if (dateTimeElement) {
    setInterval(() => {
      const now = new Date();
      dateTimeElement.textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }, 1000);
  }
}

// Initialize market overview section with real data
async function initializeMarketOverview() {
  const marketOverviewElement = document.getElementById('market-overview');
  if (!marketOverviewElement) return;
  
  try {
    // Show loading state
    marketOverviewElement.innerHTML = '<div class="col-span-full text-center text-gold-400">Loading market data...</div>';
    
    const marketIndices = await getMarketIndices();
    
    let marketOverviewHTML = '';
    marketIndices.forEach(index => {
      if (index) {
        const changeClass = index.change >= 0 ? 'text-neon-green' : 'text-red-500';
        const changeIcon = index.change >= 0 ? 
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>' : 
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>';
        
        marketOverviewHTML += `
          <div class="glass glass-hover rounded-lg p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold text-gold-400">${index.symbol}</h3>
                <span class="text-sm text-gray-400">${index.latestTradingDay}</span>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold">${formatCurrency(index.price, 'USD')}</div>
                <div class="flex items-center ${changeClass}">
                  ${changeIcon}
                  <span class="ml-1">${index.change.toFixed(2)} (${index.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    });
    
    marketOverviewElement.innerHTML = marketOverviewHTML;
  } catch (error) {
    console.error('Error initializing market overview:', error);
    marketOverviewElement.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load market data</div>';
  }
}

// Initialize watchlist section with real data
async function initializeWatchlist() {
  const watchlistElement = document.getElementById('watchlist');
  if (!watchlistElement) return;
  
  try {
    // Show loading state
    watchlistElement.innerHTML = '<div class="col-span-full text-center text-gold-400">Loading stock data...</div>';
    
    const stocks = await getMajorStocks();
    
    let watchlistHTML = '';
    stocks.forEach(stock => {
      if (stock) {
        const changeClass = stock.change >= 0 ? 'text-neon-green' : 'text-red-500';
        const changeIcon = stock.change >= 0 ? 
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>' : 
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>';
        
        watchlistHTML += `
          <div class="glass glass-hover rounded-lg p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold text-gold-400">${stock.symbol}</h3>
                <span class="text-sm text-gray-400">${stock.latestTradingDay}</span>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold">${formatCurrency(stock.price, 'USD')}</div>
                <div class="flex items-center ${changeClass}">
                  ${changeIcon}
                  <span class="ml-1">${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }
    });
    
    watchlistElement.innerHTML = watchlistHTML;
  } catch (error) {
    console.error('Error initializing watchlist:', error);
    watchlistElement.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load stock data</div>';
  }
}

// Initialize crypto tracker section with real data
async function initializeCryptoTracker() {
  const cryptoTrackerElement = document.getElementById('crypto-tracker');
  if (!cryptoTrackerElement) return;
  
  try {
    // Show loading state
    cryptoTrackerElement.innerHTML = '<div class="col-span-full text-center text-gold-400">Loading crypto data...</div>';
    
    const cryptos = await getMajorCrypto();
    
    let cryptoHTML = '';
    cryptos.forEach(crypto => {
      if (crypto) {
        cryptoHTML += `
          <div class="glass glass-hover rounded-lg p-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-semibold text-gold-400">${crypto.symbol}</h3>
                <span class="text-sm text-gray-400">${crypto.name}</span>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold">${formatCurrency(crypto.price, 'USD')}</div>
                <div class="text-sm text-gray-400">Vol: ${crypto.volume.toLocaleString()}</div>
              </div>
            </div>
          </div>
        `;
      }
    });
    
    cryptoTrackerElement.innerHTML = cryptoHTML;
  } catch (error) {
    console.error('Error initializing crypto tracker:', error);
    cryptoTrackerElement.innerHTML = '<div class="col-span-full text-center text-red-500">Failed to load crypto data</div>';
  }
}

// Refresh all dashboard data
async function refreshDashboardData() {
  try {
    await initializeMarketOverview();
    await initializeWatchlist();
    await initializeCryptoTracker();
    return true;
  } catch (error) {
    console.error('Error refreshing dashboard data:', error);
    showToast('Failed to refresh dashboard data. Please try again.', 'error');
    return false;
  }
}
