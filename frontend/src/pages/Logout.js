
// ========================================
// LifeSphere - Logout JavaScript
// File: logout.js
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logoutButton");

  if (!logoutButton) {
    console.error("Logout button not found.");
    return;
  }

  logoutButton.addEventListener("click", function () {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmLogout) {
      return;
    }

    try {
      // Remove the current login session
      localStorage.removeItem("lifesphere-logged-in-user");
      localStorage.removeItem("lifesphere-current-user-name");

      // Keep registered accounts and saved app data
      window.location.replace("login.html");
    } catch (error) {
      alert("Unable to log out. Please try again.");
      console.error("Logout error:", error);
    }
  });
});
