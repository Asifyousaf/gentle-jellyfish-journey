
// Simple about page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check if user needs to login for protected content
  checkAuthForPage();
  
  // Simple scroll animations
  setupScrollAnimations();
});

async function checkAuthForPage() {
  // Only require auth if user tries to access advanced features
  const advancedButtons = document.querySelectorAll('[data-requires-auth]');
  
  advancedButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (window.authManager && !window.authManager.user) {
        window.authManager.showLoginPrompt();
      } else {
        // Proceed with the action
        window.location.href = button.href;
      }
    });
  });
}

function setupScrollAnimations() {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
  });
}
