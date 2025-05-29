
// Simple contact page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check auth and setup forms
  checkAuthRequirement();
  setupContactForm();
  setupFAQs();
});

function checkAuthRequirement() {
  // Require login to send messages
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      if (window.authManager && !window.authManager.user) {
        e.preventDefault();
        showToast('Please sign in to send a message', 'error');
        window.authManager.showLoginPrompt();
      }
    });
  }
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      const submitBtn = document.getElementById('contact-submit');

      if (!name || !email || !message) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Simulate sending message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showToast('Message sent successfully!');
        form.reset();
        
      } catch (error) {
        showToast('Failed to send message', 'error');
      } finally {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    });
  }
}

function setupFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    
    if (header && content) {
      header.addEventListener('click', function() {
        const isHidden = content.style.display === 'none' || !content.style.display;
        
        // Close all other FAQs
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent && otherItem !== item) {
            otherContent.style.display = 'none';
          }
        });
        
        // Toggle current FAQ
        content.style.display = isHidden ? 'block' : 'none';
      });
    }
  });
}
