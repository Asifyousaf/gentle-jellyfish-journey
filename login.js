
// #i updated the import path to fix the build error
import { supabase } from './src/supabase.js';

// #i kept the DOM ready function simple for beginners to understand
document.addEventListener('DOMContentLoaded', function() {
  console.log('Login page loaded'); // #i added this to help debug if page loads
  initializeLoginForm();
  initializeRegistrationForm();
  setupFormToggle();
});

// #i made this function simple - it handles the login form submission
async function initializeLoginForm() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault(); // #i prevent the default form submission
      
      // #i get the form inputs in a simple way
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      const submitButton = document.getElementById('login-submit');
      
      // #i check if both fields are filled before proceeding
      if (!emailInput.value || !passwordInput.value) {
        showToast('Please enter both email and password', 'error');
        return;
      }
      
      // #i show loading spinner while processing
      submitButton.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mx-auto"></div>';
      submitButton.disabled = true;
      
      try {
        // #i use supabase to sign in the user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput.value,
          password: passwordInput.value,
        });

        if (error) throw error;

        // #i show success message and redirect to dashboard
        showToast('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
        
      } catch (error) {
        console.error('Login error:', error); // #i log errors for debugging
        showToast(error.message || 'Login failed. Please check your credentials.', 'error');
        // #i reset the button back to normal state
        submitButton.textContent = 'Login';
        submitButton.disabled = false;
      }
    });
  }
}

// #i made this function simple - it handles the registration form submission
async function initializeRegistrationForm() {
  const registrationForm = document.getElementById('register-form');
  
  if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
      e.preventDefault(); // #i prevent the default form submission
      
      // #i get all the registration form inputs
      const nameInput = document.getElementById('register-name');
      const emailInput = document.getElementById('register-email');
      const passwordInput = document.getElementById('register-password');
      const confirmPasswordInput = document.getElementById('register-confirm-password');
      const submitButton = document.getElementById('register-submit');
      
      // #i check if all fields are filled
      if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
        showToast('Please fill in all fields', 'error');
        return;
      }
      
      // #i check if passwords match
      if (passwordInput.value !== confirmPasswordInput.value) {
        showToast('Passwords do not match', 'error');
        return;
      }
      
      // #i show loading spinner
      submitButton.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mx-auto"></div>';
      submitButton.disabled = true;
      
      try {
        // #i use supabase to create new user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: emailInput.value,
          password: passwordInput.value,
        });

        if (authError) throw authError;

        // #i try to create user profile in the profiles table
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                email: emailInput.value,
                full_name: nameInput.value,
              }
            ]);

          if (profileError) {
            console.log('Profile creation failed, but user account was created:', profileError);
          }
        } catch (profileError) {
          console.log('Profile table might not exist, but user account was created');
        }

        // #i show success message and redirect
        showToast('Registration successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
        
      } catch (error) {
        console.error('Registration error:', error); // #i log errors for debugging
        showToast(error.message || 'Registration failed. Please try again.', 'error');
        // #i reset the button back to normal state
        submitButton.textContent = 'Create Account';
        submitButton.disabled = false;
      }
    });
  }
}

// #i made this function simple - it switches between login and register forms
function setupFormToggle() {
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const loginForm = document.getElementById('login-form-container');
  const registerForm = document.getElementById('register-form-container');
  
  if (loginLink && registerLink && loginForm && registerForm) {
    // #i handle click on login tab
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // #i hide register form and show login form
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      
      // #i update the tab styling
      registerLink.classList.remove('text-gold-400', 'border-b-2', 'border-gold-400');
      loginLink.classList.add('text-gold-400', 'border-b-2', 'border-gold-400');
    });
    
    // #i handle click on register tab
    registerLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // #i hide login form and show register form
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      
      // #i update the tab styling
      loginLink.classList.remove('text-gold-400', 'border-b-2', 'border-gold-400');
      registerLink.classList.add('text-gold-400', 'border-b-2', 'border-gold-400');
    });
  }
}
