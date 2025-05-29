
import { ChartManager } from './src/trends/chartManager.js';
import { generateMockStockData, generateMarketIndexData, generateCryptoData } from './src/trends/stockData.js';
import { setupStockLookup } from './src/trends/stockLookup.js';
import { checkAuthState, setupProfileDropdown } from './src/auth.js';

// Initialize chart manager
const chartManager = new ChartManager();

document.addEventListener('DOMContentLoaded', async function() {
  await checkAuthState();
  setupProfileDropdown();
  
  initializeMarketTrends();
  initializeStockComparison();
  initializeCryptoChart();
  setupStockLookup();
});

function initializeMarketTrends() {
  const container = document.getElementById('market-trends');
  if (!container) return;
  
  const indexData = generateMarketIndexData();
  
  let html = '';
  Object.entries(indexData).forEach(([name, data]) => {
    const changeClass = data.change >= 0 ? 'text-green-500' : 'text-red-500';
    const changeSymbol = data.change >= 0 ? '+' : '';
    
    html += `
      <div class="glass glass-hover rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gold-400 mb-2">${name}</h3>
        <div class="text-2xl font-bold text-white mb-1">${data.value.toLocaleString()}</div>
        <div class="${changeClass}">
          ${changeSymbol}${data.change.toFixed(2)}%
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function initializeStockComparison() {
  const canvas = document.getElementById('stock-comparison-chart');
  if (!canvas) return;
  
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
  const datasets = symbols.map((symbol, index) => {
    const data = generateMockStockData(symbol);
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6'];
    
    return {
      label: symbol,
      data: data.map(d => d.price),
      borderColor: colors[index],
      backgroundColor: colors[index] + '20',
      fill: false,
      tension: 0.1
    };
  });
  
  const config = {
    type: 'line',
    data: {
      labels: generateMockStockData('AAPL').map(d => d.date),
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#d1d5db' }
        }
      },
      scales: {
        x: { ticks: { color: '#9ca3af' } },
        y: { ticks: { color: '#9ca3af' } }
      }
    }
  };
  
  chartManager.createChart('stock-comparison-chart', config);
  setupStockSelectors();
}

function setupStockSelectors() {
  document.querySelectorAll('.stock-selector').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.stock-selector').forEach(btn => {
        btn.classList.remove('bg-gold-500/30');
      });
      this.classList.add('bg-gold-500/30');
      
      // Update chart with selected stock data
      const symbol = this.dataset.symbol;
      console.log(`Selected stock: ${symbol}`);
    });
  });
}

function initializeCryptoChart() {
  const canvas = document.getElementById('crypto-chart');
  if (!canvas) return;
  
  const cryptoData = generateCryptoData('1m');
  
  const config = {
    type: 'line',
    data: {
      labels: cryptoData.map(d => d.date),
      datasets: [{
        label: 'Bitcoin (BTC)',
        data: cryptoData.map(d => d.price),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b20',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#d1d5db' }
        }
      },
      scales: {
        x: { ticks: { color: '#9ca3af' } },
        y: { ticks: { color: '#9ca3af' } }
      }
    }
  };
  
  chartManager.createChart('crypto-chart', config);
  setupTimeSelectors();
}

function setupTimeSelectors() {
  document.querySelectorAll('.time-selector').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.time-selector').forEach(btn => {
        btn.classList.remove('bg-gold-500/20');
      });
      this.classList.add('bg-gold-500/20');
      
      const period = this.dataset.period;
      const newData = generateCryptoData(period);
      
      chartManager.updateChart('crypto-chart', {
        labels: newData.map(d => d.date),
        datasets: [{
          label: 'Bitcoin (BTC)',
          data: newData.map(d => d.price),
          borderColor: '#f59e0b',
          backgroundColor: '#f59e0b20',
          fill: true,
          tension: 0.1
        }]
      });
    });
  });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  chartManager.destroyAllCharts();
});
