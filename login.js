
// Simple login/signup functionality
class LoginManager {
  constructor() {
    this.supabase = null;
    this.init();
  }

  async init() {
    try {
      const { supabase } = await import('./src/supabase.js');
      this.supabase = supabase;
      this.setupForms();
      this.checkExistingAuth();
    } catch (error) {
      console.error('Login init failed:', error);
    }
  }

  async checkExistingAuth() {
    if (!this.supabase) return;
    
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session) {
        window.location.href = 'dashboard.html';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }

  setupForms() {
    // Tab switching
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      loginTab.style.color = 'var(--gold)';
      loginTab.style.borderBottomColor = 'var(--gold)';
      signupTab.style.color = 'var(--text-gray)';
      signupTab.style.borderBottomColor = 'transparent';
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    });

    signupTab.addEventListener('click', () => {
      signupTab.classList.add('active');
      loginTab.classList.remove('active');
      signupTab.style.color = 'var(--gold)';
      signupTab.style.borderBottomColor = 'var(--gold)';
      loginTab.style.color = 'var(--text-gray)';
      loginTab.style.borderBottomColor = 'transparent';
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
    });

    // Form submissions
    loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    signupForm.addEventListener('submit', (e) => this.handleSignup(e));
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit');

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      showToast('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      let message = 'Login failed. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        message = 'Invalid email or password.';
      }
      
      showToast(message, 'error');
    } finally {
      submitBtn.textContent = 'Login';
      submitBtn.disabled = false;
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const submitBtn = document.getElementById('signup-submit');

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name.trim()
          }
        }
      });

      if (error) throw error;

      showToast('Account created successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);

    } catch (error) {
      console.error('Signup error:', error);
      let message = 'Signup failed. Please try again.';
      
      if (error.message.includes('User already registered')) {
        message = 'Account already exists. Try logging in instead.';
      }
      
      showToast(message, 'error');
    } finally {
      submitBtn.textContent = 'Create Account';
      submitBtn.disabled = false;
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new LoginManager();
});
