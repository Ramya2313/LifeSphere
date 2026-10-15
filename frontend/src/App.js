
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  const accounts = JSON.parse(
    localStorage.getItem("lifesphere-demo-accounts") || "[]"
  );

  const account = accounts.find(function (item) {
    return item.email === email && item.password === password;
  });

  if (!account) {
    message.style.color = "red";
    message.textContent =
      "Account not found or password is incorrect. Create an account first.";
    return;
  }
  localStorage.setItem(
  "lifesphere-logged-in-user",
  account.email
);

window.location.href = "dashboard.html";
  

  message.style.color = "green";
  message.textContent = "Login successful! Opening dashboard...";

  setTimeout(function () {
    window.location.href = "dashboard.html";
  }, 700);
});

document.getElementById("googleLogin").addEventListener("click", function () {
  message.style.color = "red";
  message.textContent =
    "Google login is not connected yet. Please use your registered email and password.";
});
