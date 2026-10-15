
const resetForm = document.getElementById("resetForm");
const message = document.getElementById("message");

resetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value
    .trim()
    .toLowerCase();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (newPassword.length < 6) {
    message.style.color = "red";
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.style.color = "red";
    message.textContent = "Passwords do not match.";
    return;
  }

  let accounts;

  try {
    accounts = JSON.parse(
      localStorage.getItem("lifesphere-demo-accounts") || "[]"
    );
  } catch (error) {
    message.style.color = "red";
    message.textContent = "Unable to read accounts. Please try again.";
    return;
  }

  if (!Array.isArray(accounts)) {
    accounts = [];
  }

  const accountIndex = accounts.findIndex(function (account) {
    return (
      account &&
      typeof account.email === "string" &&
      account.email.toLowerCase() === email
    );
  });

  if (accountIndex === -1) {
    message.style.color = "red";
    message.textContent =
      "No account found with this email. Please sign up first.";
    return;
  }

  accounts[accountIndex].password = newPassword;

  localStorage.setItem(
    "lifesphere-demo-accounts",
    JSON.stringify(accounts)
  );

  message.style.color = "#26734e";
  message.textContent =
    "Password updated successfully! Redirecting to login...";

  resetForm.reset();

  setTimeout(function () {
    window.location.href = "login.html";
  }, 1500);
});
