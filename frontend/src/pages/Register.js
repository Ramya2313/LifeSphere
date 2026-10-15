const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("message");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName")
    .value.trim();

  const email = document.getElementById("email")
    .value.trim().toLowerCase();

  const password = document.getElementById("password").value;
  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (!fullName) {
    showMessage("Please enter your name.", true);
    return;
  }

  if (password.length < 8) {
    showMessage("Password must be at least 8 characters.", true);
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", true);
    return;
  }

  let accounts;

  try {
    accounts = JSON.parse(
      localStorage.getItem("lifesphere-demo-accounts") || "[]"
    );
  } catch {
    accounts = [];
  }

  if (!Array.isArray(accounts)) accounts = [];

  const alreadyExists = accounts.some(
    user => user.email === email
  );

  if (alreadyExists) {
    showMessage("An account with this email already exists.", true);
    return;
  }

  accounts.push({
    fullName,
    email,
    password
  });

  try {
    localStorage.setItem(
      "lifesphere-demo-accounts",
      JSON.stringify(accounts)
    );
  } catch {
    showMessage(
      "Could not save your account. Check browser storage.",
      true
    );
    return;
  }

  registerForm.reset();

  showMessage(
    "Account created successfully! Redirecting to login…",
    false
  );

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1000);
});

function showMessage(text, isError) {
  registerMessage.textContent = text;
  registerMessage.className =
    isError ? "message error" : "message success";
}