
// Stock lookup functionality
export function setupStockLookup() {
  const form = document.getElementById('stock-search-form');
  const input = document.getElementById('stock-search-input');
  const resultsSection = document.getElementById('stock-lookup-section');
  const resultsContainer = document.getElementById('stock-results');
  
  if (!form || !input || !resultsSection || !resultsContainer) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const symbol = input.value.trim().toUpperCase();
    if (!symbol) return;
    
    // Show loading
    resultsContainer.innerHTML = '<div class="flex justify-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div></div>';
    resultsSection.classList.remove('hidden');
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        symbol: symbol,
        name: `${symbol} Company`,
        price: (Math.random() * 500 + 50).toFixed(2),
        change: ((Math.random() - 0.5) * 10).toFixed(2),
        changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
        marketCap: `$${(Math.random() * 100 + 10).toFixed(1)}B`,
        volume: `${(Math.random() * 10 + 1).toFixed(1)}M`
      };
      
      renderStockInfo(resultsContainer, mockData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      resultsContainer.innerHTML = '<p class="text-red-500 text-center py-8">Failed to fetch stock data. Please try again later.</p>';
    }
  });
}

function renderStockInfo(container, data) {
  const changeClass = parseFloat(data.change) >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSymbol = parseFloat(data.change) >= 0 ? '+' : '';
  
  container.innerHTML = `
    <div class="glass rounded-lg p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-2xl font-bold text-gold-400">${data.symbol}</h3>
          <p class="text-gray-300">${data.name}</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-white">$${data.price}</div>
          <div class="${changeClass}">
            ${changeSymbol}${data.change} (${changeSymbol}${data.changePercent}%)
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-black/30 rounded-lg p-4">
          <p class="text-gray-400 text-sm">Market Cap</p>
          <p class="text-white font-semibold">${data.marketCap}</p>
        </div>
        <div class="bg-black/30 rounded-lg p-4">
          <p class="text-gray-400 text-sm">Volume</p>
          <p class="text-white font-semibold">${data.volume}</p>
        </div>
      </div>
    </div>
  `;
}
