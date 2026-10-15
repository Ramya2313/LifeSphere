
// ========================================
// LifeSphere - Login JavaScript
// File: login.js
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");
  const rememberMe = document.getElementById("rememberMe");

  // Check whether the required HTML elements exist
  if (!loginForm || !emailInput || !passwordInput || !message) {
    console.error(
      "Login form elements are missing. Check login.html IDs."
    );
    return;
  }

  const ACCOUNTS_KEY = "lifesphere-demo-accounts";
  const LOGIN_KEY = "lifesphere-logged-in-user";
  const USER_NAME_KEY = "lifesphere-current-user-name";

  // Display login messages
  function showMessage(text, success = false) {
    message.textContent = text;
    message.style.color = success ? "#16834a" : "#dc2626";
  }

  // Load saved email, if available
  try {
    const savedEmail = localStorage.getItem("lifesphere-remembered-email");

    if (savedEmail) {
      emailInput.value = savedEmail;

      if (rememberMe) {
        rememberMe.checked = true;
      }
    }
  } catch (error) {
    console.warn("Could not load saved email.");
  }

  // Handle login form submission
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // Validate inputs
    if (!email || !password) {
      showMessage("Please enter your email and password.");
      return;
    }

    // Read registered demo accounts
    let accounts = [];

    try {
      accounts = JSON.parse(
        localStorage.getItem(ACCOUNTS_KEY) || "[]"
      );

      if (!Array.isArray(accounts)) {
        accounts = [];
      }
    } catch (error) {
      showMessage("Unable to read accounts. Please try again.");
      return;
    }

    // Find the matching account
    const account = accounts.find(function (user) {
      return (
        user &&
        typeof user.email === "string" &&
        typeof user.password === "string" &&
        user.email.trim().toLowerCase() === email &&
        user.password === password
      );
    });

    // Show error if credentials do not match
    if (!account) {
      showMessage(
        "Invalid email or password. Please create an account first."
      );
      return;
    }

    // Save login information
    try {
      localStorage.setItem(LOGIN_KEY, account.email);
      localStorage.setItem(
        USER_NAME_KEY,
        account.fullName || "User"
      );

      // Remember email only if selected
      if (rememberMe && rememberMe.checked) {
        localStorage.setItem(
          "lifesphere-remembered-email",
          email
        );
      } else {
        localStorage.removeItem("lifesphere-remembered-email");
      }
    } catch (error) {
      showMessage(
        "Unable to save login information. Check browser storage settings."
      );
      return;
    }

    // Successful login
    showMessage("Login successful! Opening your dashboard...", true);

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  });
});
