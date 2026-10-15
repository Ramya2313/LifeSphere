
export default function more(root, data, save) {
  data.profile = data.profile || { name: "Ramya" };

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function getCurrentPage() {
    const active = document.querySelector(".app-nav button.active");
    return active?.dataset.page || "contact";
  }

  function render() {
    const page = getCurrentPage();

    if (page === "profile") {
      renderProfile();
    } else if (page === "settings") {
      renderSettings();
    } else {
      renderContact();
    }
  }

  function renderProfile() {
    root.innerHTML = `
      <section class="more-page">
        <div class="more-header">
          <h2>👤 My Profile</h2>
          <p>Make your LifeSphere your own.</p>
        </div>

        <form id="profile-form" class="more-card">
          <div class="profile-avatar">🌿</div>

          <label for="profile-name">Your Name</label>
          <input id="profile-name" type="text" maxlength="80"
            value="${escapeHTML(data.profile.name || "")}" required />

          <button type="submit">Save Profile</button>
          <p id="profile-message" class="more-message" aria-live="polite"></p>
        </form>
      </section>
    `;

    root.querySelector("#profile-form").addEventListener("submit", event => {
      event.preventDefault();

      const name = root.querySelector("#profile-name").value.trim();
      if (!name) return;

      data.profile.name = name;
      save();

      root.querySelector("#profile-message").textContent =
        "Profile saved successfully! 🌱";
    });
  }

  function renderSettings() {
    root.innerHTML = `
      <section class="more-page">
        <div class="more-header">
          <h2>⚙️ Settings</h2>
          <p>Customize your LifeSphere experience.</p>
        </div>

        <div class="more-card">
          <h3>Appearance</h3>
          <label class="more-setting">
            <span>🌙 Dark mode</span>
            <input id="dark-mode" type="checkbox" />
          </label>

          <p class="more-muted">
            Your appearance preference applies to this browser session.
          </p>
        </div>

        <div class="more-card">
          <h3>Data Management</h3>
          <p>Download a backup of your LifeSphere data.</p>
          <button id="export-data" type="button">⬇️ Export My Data</button>

          <p class="more-muted">
            Export creates a JSON backup on your device.
          </p>
        </div>

        <div class="more-card">
          <h3>About LifeSphere</h3>
          <p>🌿 Plan • Organize • Grow</p>
          <p class="more-muted">Small steps, big growth.</p>
        </div>
      </section>
    `;

    const darkMode = root.querySelector("#dark-mode");
    darkMode.checked = document.body.classList.contains("lifesphere-dark");

    darkMode.addEventListener("change", () => {
      document.body.classList.toggle("lifesphere-dark", darkMode.checked);
    });

    root.querySelector("#export-data").addEventListener("click", () => {
      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "lifesphere-backup.json";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  function renderContact() {
    root.innerHTML = `
      <section class="more-page">
        <div class="more-header">
          <h2>✉️ Contact Us</h2>
          <p>Questions or suggestions? Write them down below.</p>
        </div>

        <form id="contact-form" class="more-card">
          <label for="contact-name">Your Name</label>
          <input id="contact-name" type="text" maxlength="80"
            value="${escapeHTML(data.profile.name || "")}" required />

          <label for="contact-email">Email Address</label>
          <input id="contact-email" type="email" maxlength="150"
            placeholder="you@example.com" required />

          <label for="contact-message">Message</label>
          <textarea id="contact-message" rows="5" maxlength="2000"
            placeholder="Type your message..." required></textarea>

          <button type="submit">Prepare Email</button>

          <p class="more-muted">
            This opens your email application; it does not send a message
            automatically.
          </p>
        </form>
      </section>
    `;

    root.querySelector("#contact-form").addEventListener("submit", event => {
      event.preventDefault();

      const name = root.querySelector("#contact-name").value.trim();
      const email = root.querySelector("#contact-email").value.trim();
      const message = root.querySelector("#contact-message").value.trim();

      const subject = encodeURIComponent("LifeSphere message");
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );

      // Replace this example address with your actual support email.
      window.location.href =
        `mailto:support@example.com?subject=${subject}&body=${body}`;
    });
  }

  render();
}
