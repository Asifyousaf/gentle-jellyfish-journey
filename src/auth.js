
// Authentication module - handles login/logout and profile management
import { supabase } from './supabase.js';

export async function checkAuthState() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const loginLink = document.getElementById('login-link');
    const profileContainer = document.getElementById('profile-container');
    
    // Add placeholder elements to prevent layout shift
    if (loginLink) loginLink.style.visibility = 'hidden';
    if (profileContainer) profileContainer.style.visibility = 'hidden';
    
    if (session) {
      if (loginLink) {
        loginLink.style.display = 'none';
        loginLink.style.visibility = 'visible';
      }
      
      if (profileContainer) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', session.user.id)
          .single();
          
        profileContainer.style.display = 'flex';
        profileContainer.style.visibility = 'visible';
        
        const nameSpan = document.getElementById('profile-name');
        const emailDiv = document.getElementById('profile-email');
        
        if (nameSpan) nameSpan.textContent = profile?.full_name || 'User';
        if (emailDiv) emailDiv.textContent = session.user.email;
      }
    } else {
      if (loginLink) {
        loginLink.style.display = 'flex';
        loginLink.style.visibility = 'visible';
      }
      if (profileContainer) {
        profileContainer.style.display = 'none';
        profileContainer.style.visibility = 'visible';
      }
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
  }
}

export function setupProfileDropdown() {
  const profileButton = document.getElementById('profile-button');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  if (profileButton && profileDropdown) {
    profileButton.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Error signing out:', error);
        showToast('Error signing out', 'error');
      }
    });
  }
}
