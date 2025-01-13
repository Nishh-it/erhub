document.addEventListener("DOMContentLoaded", () => {
    // Select the necessary DOM elements
    const wrapper = document.querySelector('.wrapper');
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const createLink = document.querySelector('.create-link');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
    const forgotLink = document.querySelector('.forgot-link');

    // Event listener for the "Register" link
    registerLink.addEventListener('click', () => {
        console.log("Register link clicked");
        wrapper.classList.add('active');
        wrapper.classList.remove('set');
    });

    // Event listener for the "Create" link
    createLink.addEventListener('click', () => {
        console.log("Create link clicked");
        wrapper.classList.add('active');
        wrapper.classList.remove('set');
    });

    // Event listener for the "Login" link
    loginLink.addEventListener('click', () => {
        console.log("Login link clicked");
        wrapper.classList.remove('active', 'set');
    });

    // Event listener for the "Forgot Password" link
    forgotLink.addEventListener('click', () => {
        console.log("Forgot password clicked");
        wrapper.classList.add('set');
    });

    // Event listener for the Login button
    btnPopup.addEventListener('click', () => {
        console.log("Login popup clicked");
        wrapper.classList.add('active-popup');
    });

    // Event listener for the close icon
    iconClose.addEventListener('click', () => {
        console.log("Close icon clicked");
        wrapper.classList.remove('active-popup', 'active', 'set');
    });
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const form = e.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    console.log("Form data to be sent:", formObject); // Check what data is being sent

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        });

        const data = await response.json();
        if (!response.ok) {
            displayErrorMessage(data.message); // Show the error message
            return;
        }

        alert(data.message); // Show success message
        window.location.href = '/login'; // Redirect after successful registration
    } catch (error) {
        console.error('Error submitting form:', error);
        displayErrorMessage('An unexpected error occurred.');
    }
});

function displayErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message; // Update the error message
        errorElement.style.display = 'block'; // Make it visible
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const form = e.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();
        console.log("Server response:", result);  // Log the server response

        if (response.ok) {
            // Store token in localStorage and update UI
            localStorage.setItem("token", result.token);
            document.getElementById('btnLogin').style.display = 'none'; // Hide login button
            document.getElementById('btnLogout').style.display = 'block'; // Show logout button

            // Check if redirect URL is available
            if (result.redirect) {
                console.log("Redirecting to:", result.redirect); // Log the redirect URL
                window.location.href = result.redirect; // Redirect to the specified URL
            } else {
                alert("Redirect URL is not specified.");
            }
        } else {
            alert(result.message || "Login failed!");
        }
    } catch (error) {
        console.error('Error submitting form:', error);  // Log the error details
        alert('An unexpected error occurred. Check the console for details.');
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.querySelector("#btnLogin");
    const btnLogout = document.querySelector("#btnLogout");
    const wrapper = document.querySelector('.wrapper');
    const loginForm = document.getElementById("loginForm");

    // Check if user is logged in by checking the presence of the token
    if (localStorage.getItem('token')) {
        btnLogin.style.display = 'none'; // Hide login button
        btnLogout.style.display = 'block'; // Show logout button
    } else {
        btnLogin.style.display = 'block'; // Show login button
        btnLogout.style.display = 'none'; // Hide logout button
    }

    // Logout function
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("token"); // Remove the token
        window.location.href = '/home'; // Redirect to login page or home page
    });

    // Handle login form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const formObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(loginForm.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formObject),
            });

            const result = await response.json();

            if (response.ok) {
                // Store token in localStorage and update UI
                localStorage.setItem("token", result.token);
                btnLogin.style.display = 'none'; // Hide login button
                btnLogout.style.display = 'block'; // Show logout button
                window.location.href = result.redirect; // Redirect to home page
            } else {
                // Show error message
                alert(result.message || "Login failed!");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An unexpected error occurred.");
        }
    });
});

  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from reloading the page
    
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Send POST request to the server for login
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Login successful!") {
        // If login is successful, store the JWT token and redirect to home
        localStorage.setItem('token', data.token);  // Store token in localStorage (or sessionStorage)

        // Redirect to home page
        window.location.href = data.redirect;  // Redirect to home.html (or /home route)
      } else {
        alert('Invalid login credentials');
      }
    })
    .catch(err => {
      console.error('Error:', err);
    });
  });
