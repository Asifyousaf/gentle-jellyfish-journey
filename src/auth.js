
// Authentication module - handles login/logout and profile management
import { supabase } from './supabase.js';

export async function checkAuthState() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const loginLink = document.getElementById('login-link');
    const profileContainer = document.getElementById('profile-container');
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const mobileProfileSection = document.getElementById('mobile-profile-section');
    
    // Add placeholder elements to prevent layout shift
    if (loginLink) loginLink.style.visibility = 'hidden';
    if (profileContainer) profileContainer.style.visibility = 'hidden';
    if (mobileLoginLink) mobileLoginLink.style.visibility = 'hidden';
    if (mobileProfileSection) mobileProfileSection.style.visibility = 'hidden';
    
    if (session) {
      // Hide login links
      if (loginLink) {
        loginLink.style.display = 'none';
        loginLink.style.visibility = 'visible';
      }
      if (mobileLoginLink) {
        mobileLoginLink.style.display = 'none';
        mobileLoginLink.style.visibility = 'visible';
      }
      
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single();
      
      // Show desktop profile
      if (profileContainer) {
        profileContainer.style.display = 'flex';
        profileContainer.style.visibility = 'visible';
        
        const nameSpan = document.getElementById('profile-name');
        const emailDiv = document.getElementById('profile-email');
        
        if (nameSpan) nameSpan.textContent = profile?.full_name || 'User';
        if (emailDiv) emailDiv.textContent = session.user.email;
      }
      
      // Show mobile profile
      if (mobileProfileSection) {
        mobileProfileSection.style.display = 'block';
        mobileProfileSection.style.visibility = 'visible';
        mobileProfileSection.classList.remove('hidden');
        
        const mobileNameSpan = document.getElementById('mobile-profile-name');
        const mobileEmailDiv = document.getElementById('mobile-profile-email');
        
        if (mobileNameSpan) mobileNameSpan.textContent = profile?.full_name || 'User';
        if (mobileEmailDiv) mobileEmailDiv.textContent = session.user.email;
      }
    } else {
      // Show login links
      if (loginLink) {
        loginLink.style.display = 'flex';
        loginLink.style.visibility = 'visible';
      }
      if (mobileLoginLink) {
        mobileLoginLink.style.display = 'block';
        mobileLoginLink.style.visibility = 'visible';
      }
      
      // Hide profile containers
      if (profileContainer) {
        profileContainer.style.display = 'none';
        profileContainer.style.visibility = 'visible';
      }
      if (mobileProfileSection) {
        mobileProfileSection.style.display = 'none';
        mobileProfileSection.style.visibility = 'visible';
        mobileProfileSection.classList.add('hidden');
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

  // Desktop logout
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

  // Mobile logout
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', async () => {
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
