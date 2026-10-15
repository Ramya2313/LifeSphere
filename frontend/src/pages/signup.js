
// LifeSphere Signup JavaScript

const signupForm = document.getElementById("signupForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const message = document.getElementById("message");

function showMessage(text, color) {
  if (message) {
    message.textContent = text;
    message.style.color = color;
  }
}

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput
      ? confirmPasswordInput.value
      : password;

    if (!fullName || !email || !password) {
      showMessage("Please fill in all required fields.", "red");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "red");
      return;
    }

    if (password.length < 6) {
      showMessage(
        "Password must contain at least 6 characters.",
        "red"
      );
      return;
    }

    let accounts = [];

    try {
      accounts = JSON.parse(
        localStorage.getItem("lifesphere-demo-accounts") || "[]"
      );
    } catch (error) {
      showMessage("Unable to read saved accounts.", "red");
      return;
    }

    if (!Array.isArray(accounts)) {
      accounts = [];
    }

    const existingAccount = accounts.find(function (account) {
      return (
        account &&
        typeof account.email === "string" &&
        account.email.toLowerCase() === email
      );
    });

    if (existingAccount) {
      showMessage(
        "This email is already registered. Please log in.",
        "red"
      );
      return;
    }

    accounts.push({
      fullName: fullName,
      email: email,
      password: password
    });

    localStorage.setItem(
      "lifesphere-demo-accounts",
      JSON.stringify(accounts)
    );
    accounts = JSON.parse(
  localStorage.getItem("lifesphere-demo-accounts") || "[]"
);
    showMessage(
      "Account created successfully! Opening login page...",
      "green"
    );
   JSON.parse(localStorage.getItem("lifesphere-demo-accounts") || "[]")
    setTimeout(function () {
      window.location.href = "login.html";
    }, 1000);
  });
}
