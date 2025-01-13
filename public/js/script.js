// DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const createLink = document.querySelector('.create-link');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
    const forgotLink = document.querySelector('.forgot-link');
    const logoutButton = document.getElementById('btnLogout');

    // Toggle form views
    registerLink.addEventListener('click', () => {
        wrapper.classList.add('active');
        wrapper.classList.remove('set');
    });

    createLink.addEventListener('click', () => {
        wrapper.classList.add('active');
        wrapper.classList.remove('set');
    });

    loginLink.addEventListener('click', () => {
        wrapper.classList.remove('active', 'set');
    });

    forgotLink.addEventListener('click', () => {
        wrapper.classList.add('set');
    });

    btnPopup.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
    });

    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup', 'active', 'set');
    });

    // Login form submission
    const loginForm = document.querySelector('#loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();

        if (!email || !password) {
            showError('.error-message', 'Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                // Handle UI update for logged-in state
                loginForm.reset();
                logoutButton.style.display = 'inline-block';
                btnPopup.style.display = 'none';
                wrapper.classList.remove('active-popup');
            } else {
                showError('.error-message', data.message || 'Login failed.');
            }
        } catch (error) {
            console.error(error);
            showError('.error-message', 'An error occurred. Please try again.');
        }
    });

    // Register form submission
    const registerForm = document.querySelector('#registerForm');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = registerForm.username.value.trim();
        const email = registerForm.email.value.trim();
        const password = registerForm.password.value.trim();

        if (!username || !email || !password) {
            showError('#register-error-message', 'All fields are required.');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful!');
                registerForm.reset();
                wrapper.classList.remove('active');
            } else {
                showError('#register-error-message', data.message || 'Registration failed.');
            }
        } catch (error) {
            console.error(error);
            showError('#register-error-message', 'An error occurred. Please try again.');
        }
    });

    // Forgot password form submission
    const resetPasswordForm = document.querySelector('#resetPasswordForm');
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = resetPasswordForm.email.value.trim();

        if (!email) {
            showError('#forgot-error-message', 'Please enter your email.');
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Password reset link sent!');
                resetPasswordForm.reset();
                wrapper.classList.remove('set');
            } else {
                showError('#forgot-error-message', data.message || 'Failed to send reset link.');
            }
        } catch (error) {
            console.error(error);
            showError('#forgot-error-message', 'An error occurred. Please try again.');
        }
    });

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        // Clear session or token (depends on implementation)
        alert('You have been logged out.');
        logoutButton.style.display = 'none';
        btnPopup.style.display = 'inline-block';
    });

    // Utility function to display error messages
    function showError(selector, message) {
        const errorElement = document.querySelector(selector);
        errorElement.textContent = message;
        errorElement.style.display = 'block';

        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
});
