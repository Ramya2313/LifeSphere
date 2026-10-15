
// ========================================
// LifeSphere - My Profile
// File: profile.js
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("profileForm");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const birthdayInput = document.getElementById("birthday");
  const occupationInput = document.getElementById("occupation");
  const bioInput = document.getElementById("bio");
  const avatar = document.getElementById("avatar");
  const headingName = document.getElementById("headingName");
  const message = document.getElementById("message");
  const resetButton = document.getElementById("resetButton");

  const LOGIN_KEY = "lifesphere-logged-in-user";
  const ACCOUNTS_KEY = "lifesphere-demo-accounts";
  const USER_NAME_KEY = "lifesphere-current-user-name";

  // Check that the profile page elements exist
  if (
    !form || !fullNameInput || !emailInput || !phoneInput ||
    !birthdayInput || !occupationInput || !bioInput ||
    !avatar || !headingName || !message || !resetButton
  ) {
    console.error("Profile page elements are missing. Check profile.html.");
    return;
  }

  // Get the logged-in user's email
  const loggedInEmail = localStorage.getItem(LOGIN_KEY);

  if (!loggedInEmail) {
    window.location.replace("login.html");
    return;
  }

  // Each account has its own profile
  const profileKey =
    "lifesphere-profile-" + loggedInEmail.trim().toLowerCase();

  let lastSavedProfile = {};

  function showMessage(text, success = true) {
    message.textContent = text;
    message.style.color = success ? "#16834a" : "#dc2626";
  }

  function updateHeading(name) {
    const displayName = name.trim() || "My Profile";

    headingName.textContent = displayName;
    avatar.textContent = displayName.charAt(0).toUpperCase();
  }

  function getAccounts() {
    try {
      const accounts = JSON.parse(
        localStorage.getItem(ACCOUNTS_KEY) || "[]"
      );

      return Array.isArray(accounts) ? accounts : [];
    } catch (error) {
      return [];
    }
  }

  function loadProfile() {
    const accounts = getAccounts();

    const account = accounts.find(function (item) {
      return (
        item &&
        typeof item.email === "string" &&
        item.email.trim().toLowerCase() ===
          loggedInEmail.trim().toLowerCase()
      );
    });

    let profile = {};

    try {
      profile = JSON.parse(
        localStorage.getItem(profileKey) || "{}"
      );
    } catch (error) {
      profile = {};
    }

    if (
      !profile ||
      typeof profile !== "object" ||
      Array.isArray(profile)
    ) {
      profile = {};
    }

    const defaultName =
      (account && account.fullName) ||
      localStorage.getItem(USER_NAME_KEY) ||
      "";

    lastSavedProfile = {
      fullName: profile.fullName || defaultName,
      phone: profile.phone || "",
      birthday: profile.birthday || "",
      occupation: profile.occupation || "",
      bio: profile.bio || ""
    };

    fullNameInput.value = lastSavedProfile.fullName;
    emailInput.value = loggedInEmail;
    phoneInput.value = lastSavedProfile.phone;
    birthdayInput.value = lastSavedProfile.birthday;
    occupationInput.value = lastSavedProfile.occupation;
    bioInput.value = lastSavedProfile.bio;

    updateHeading(lastSavedProfile.fullName);
  }

  // Update the avatar and heading while typing
  fullNameInput.addEventListener("input", function () {
    updateHeading(fullNameInput.value);
  });

  // Save profile details
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();

    if (!fullName) {
      showMessage("Please enter your full name.", false);
      fullNameInput.focus();
      return;
    }

    const profile = {
      fullName: fullName,
      phone: phoneInput.value.trim(),
      birthday: birthdayInput.value,
      occupation: occupationInput.value.trim(),
      bio: bioInput.value.trim()
    };

    try {
      // Save this user's profile
      localStorage.setItem(profileKey, JSON.stringify(profile));

      // Update the name used by the dashboard
      localStorage.setItem(USER_NAME_KEY, fullName);

      // Update the name in the demo registration account
      const accounts = getAccounts();

      const updatedAccounts = accounts.map(function (account) {
        if (
          account &&
          typeof account.email === "string" &&
          account.email.trim().toLowerCase() ===
            loggedInEmail.trim().toLowerCase()
        ) {
          return {
            ...account,
            fullName: fullName
          };
        }

        return account;
      });

      localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify(updatedAccounts)
      );

      lastSavedProfile = profile;
      updateHeading(fullName);
      showMessage("Profile saved successfully! 🎉");
    } catch (error) {
      showMessage(
        "Unable to save. Please check your browser storage settings.",
        false
      );
    }
  });

  // Restore the last saved values
  resetButton.addEventListener("click", function () {
    loadProfile();
    showMessage("Your last saved profile has been restored.");
  });

  // Load profile when the page opens
  loadProfile();
});
