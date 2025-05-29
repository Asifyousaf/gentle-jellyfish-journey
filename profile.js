
// Simple profile management
class ProfileManager {
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
      this.setupForm();
    } catch (error) {
      console.error('Profile init failed:', error);
    }
  }

  async checkAuth() {
    if (!this.supabase) return;
    
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (!session) {
        window.location.href = 'login.html';
        return;
      }
      
      this.user = session.user;
      await this.loadProfile();
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = 'login.html';
    }
  }

  async loadProfile() {
    if (!this.user) return;
    
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Fill form with data
      document.getElementById('email').value = this.user.email || '';
      document.getElementById('full-name').value = profile?.full_name || '';
      
    } catch (error) {
      console.error('Profile load failed:', error);
      showToast('Failed to load profile', 'error');
    }
  }

  setupForm() {
    const form = document.getElementById('profile-form');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    form.addEventListener('submit', (e) => this.handleSave(e));
    changePasswordBtn.addEventListener('click', () => this.handleChangePassword());
    deleteAccountBtn.addEventListener('click', () => this.handleDeleteAccount());
  }

  async handleSave(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('full-name').value;
    const saveBtn = document.getElementById('save-btn');

    if (!fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    try {
      const { error } = await this.supabase
        .from('profiles')
        .upsert({
          id: this.user.id,
          email: this.user.email,
          full_name: fullName.trim(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      showToast('Profile updated successfully!');
      
    } catch (error) {
      console.error('Profile save failed:', error);
      showToast('Failed to save profile', 'error');
    } finally {
      saveBtn.textContent = 'Save Changes';
      saveBtn.disabled = false;
    }
  }

  async handleChangePassword() {
    const newPassword = prompt('Enter new password (min. 6 characters):');
    
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      showToast('Password updated successfully!');
      
    } catch (error) {
      console.error('Password change failed:', error);
      showToast('Failed to change password', 'error');
    }
  }

  async handleDeleteAccount() {
    const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    
    if (!confirm) return;

    try {
      // Delete profile first
      await this.supabase
        .from('profiles')
        .delete()
        .eq('id', this.user.id);

      showToast('Account deleted successfully');
      
      // Sign out and redirect
      await this.supabase.auth.signOut();
      window.location.href = 'index.html';
      
    } catch (error) {
      console.error('Account deletion failed:', error);
      showToast('Failed to delete account', 'error');
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new ProfileManager();
});
