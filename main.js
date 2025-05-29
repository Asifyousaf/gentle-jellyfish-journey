
// Main JavaScript - simplified entry point that imports modular functionality
import { checkAuthState, setupProfileDropdown } from './src/auth.js';
import { showToast, debounce, setupSmoothScrolling } from './src/ui.js';
import { formatCurrency, formatPercentage, formatDate, formatTime, formatDateTime } from './src/formatters.js';
import { setupNewsletterSubscription } from './src/newsletter.js';

// Initialize auth state and profile dropdown
document.addEventListener('DOMContentLoaded', async function() {
  await checkAuthState();
  setupProfileDropdown();
  setupNewsletterSubscription();
  setupSmoothScrolling();
});

// Export global functions for backward compatibility
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.formatPercentage = formatPercentage;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;
window.debounce = debounce;
