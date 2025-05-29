
// Newsletter subscription module
import { showToast } from './ui.js';

export function setupNewsletterSubscription() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('subscribe-btn');
    const email = emailInput.value;
    
    if (!email) return;
    
    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      showToast('Successfully subscribed! You\'ll receive the latest financial updates in your inbox.');
      emailInput.value = '';
    } catch (error) {
      // Show error toast
      showToast('Subscription failed. Please try again later.', 'error');
    } finally {
      submitBtn.textContent = 'Subscribe to Newsletter';
      submitBtn.disabled = false;
    }
  });
}
