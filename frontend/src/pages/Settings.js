
document.addEventListener("DOMContentLoaded", function () {
  const displayName = document.getElementById("displayName");
  const theme = document.getElementById("theme");
  const compactLayout = document.getElementById("compactLayout");
  const showWelcome = document.getElementById("showWelcome");
  const saveButton = document.getElementById("saveSettings");
  const resetButton = document.getElementById("resetSettings");
  const logoutButton = document.getElementById("logoutButton");
  const message = document.getElementById("message");

  const SETTINGS_KEY = "lifesphere-settings";
  const validThemes = ["purple", "pink", "blue", "green"];

  function showMessage(text, success = true) {
    message.textContent = text;
    message.style.color = success ? "#16834a" : "#dc2626";
  }

  function getSettings() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SETTINGS_KEY) || "{}"
      );

      return saved && typeof saved === "object" && !Array.isArray(saved)
        ? saved
        : {};
    } catch (error) {
      return {};
    }
  }

  function applyTheme(selectedTheme) {
    document.body.classList.remove(
      "theme-pink",
      "theme-blue",
      "theme-green"
    );

    if (selectedTheme !== "purple") {
      document.body.classList.add("theme-" + selectedTheme);
    }
  }

  function applySettings(settings) {
    const selectedTheme = validThemes.includes(settings.theme)
      ? settings.theme
      : "purple";

    theme.value = selectedTheme;
    compactLayout.checked = settings.compactLayout === true;
    showWelcome.checked = settings.showWelcome !== false;
    displayName.value = settings.displayName || "";

    applyTheme(selectedTheme);
    document.body.classList.toggle(
      "compact",
      compactLayout.checked
    );
  }

  function saveSettings() {
    const name = displayName.value.trim();

    const settings = {
      displayName: name,
      theme: validThemes.includes(theme.value)
        ? theme.value
        : "purple",
      compactLayout: compactLayout.checked,
      showWelcome: showWelcome.checked
    };

    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
      );

      applySettings(settings);
      showMessage("Settings saved successfully! 🎉");
    } catch (error) {
      showMessage("Unable to save settings in browser storage.", false);
    }
  }

  saveButton.addEventListener("click", saveSettings);

  resetButton.addEventListener("click", function () {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      applySettings({});
      showMessage("Settings restored to defaults.");
    } catch (error) {
      showMessage("Unable to reset settings.", false);
    }
  });

  theme.addEventListener("change", function () {
    applyTheme(theme.value);
  });

  compactLayout.addEventListener("change", function () {
    document.body.classList.toggle(
      "compact",
      compactLayout.checked
    );
  });

  logoutButton.addEventListener("click", function () {
    if (!window.confirm("Are you sure you want to log out?")) {
      return;
    }

    localStorage.removeItem("lifesphere-logged-in-user");
    localStorage.removeItem("lifesphere-current-user-name");

    window.location.href = "login.html";
  });

  applySettings(getSettings());
});
