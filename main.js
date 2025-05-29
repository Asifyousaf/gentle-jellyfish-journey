
// Simple authentication check and utilities
class AuthManager {
  constructor() {
    this.supabase = null;
    this.user = null;
    this.init();
  }

  async init() {
    try {
      const { supabase } = await import('./src/supabase.js');
      this.supabase = supabase;
      await this.checkAuth();
      this.setupAuthListener();
    } catch (error) {
      console.error('Auth init failed:', error);
    }
  }

  async checkAuth() {
    if (!this.supabase) return false;
    
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.user = session?.user || null;
      this.updateNavigation();
      return !!this.user;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  setupAuthListener() {
    if (!this.supabase) return;
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.user = session?.user || null;
      this.updateNavigation();
    });
  }

  updateNavigation() {
    const loginBtn = document.getElementById('login-btn');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (this.user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (profileLink) profileLink.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
      if (profileLink) profileLink.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  async logout() {
    if (!this.supabase) return;
    
    try {
      await this.supabase.auth.signOut();
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  requireAuth() {
    if (!this.user) {
      this.showLoginPrompt();
      return false;
    }
    return true;
  }

  showLoginPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'login-prompt';
    prompt.innerHTML = `
      <div class="login-card">
        <h2 style="color: var(--gold); margin-bottom: 1rem;">Login Required</h2>
        <p style="color: var(--text-gray); margin-bottom: 2rem;">Please sign in to access this page</p>
        <div class="flex-center space-y">
          <a href="login.html" class="btn btn-primary">Sign In</a>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-outline">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(prompt);
  }
}

// Global auth manager
window.authManager = new AuthManager();

// Simple toast function
window.showToast = function(message, type = 'success') {
  const toast = document.getElementById('toast') || createToast();
  const toastMessage = toast.querySelector('.toast-message') || toast;
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  if (type === 'error') {
    toast.style.borderColor = '#ef4444';
    toast.style.color = '#ef4444';
  } else {
    toast.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    toast.style.color = '#f59e0b';
  }
  
  setTimeout(() => toast.classList.remove('show'), 3000);
};

function createToast() {
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.innerHTML = '<span class="toast-message"></span>';
  document.body.appendChild(toast);
  return toast;
}

// Setup navigation on page load
document.addEventListener('DOMContentLoaded', function() {
  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => window.authManager.logout());
  }
});
