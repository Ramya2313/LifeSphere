
document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // STORAGE AND DATE
  // ========================================
  const STORAGE_KEY = "lifesphere-wellness-all-data";
  const JOURNAL_KEY = "lifesphere-wellness-journal";

  const today = new Date();

  function getLocalDate() {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  }

  const todayKey = getLocalDate();

  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      return {
        days: saved.days && typeof saved.days === "object"
          ? saved.days
          : {},
        reflections: saved.reflections && typeof saved.reflections === "object"
          ? saved.reflections
          : {}
      };
    } catch (error) {
      return { days: {}, reflections: {} };
    }
  }

  let data = loadData();

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      alert("Unable to save data. Please check your browser storage settings.");
      return false;
    }
  }

  function getDay(date = todayKey) {
    if (!data.days[date]) {
      data.days[date] = {
        mood: "",
        water: 0,
        sleep: 0,
        movement: 0,
        checklist: [false, false, false, false, false]
      };
    }

    const day = data.days[date];

    day.mood = day.mood || "";
    day.water = Number(day.water) || 0;
    day.sleep = Number(day.sleep) || 0;
    day.movement = Number(day.movement) || 0;

    if (!Array.isArray(day.checklist)) {
      day.checklist = [false, false, false, false, false];
    }

    while (day.checklist.length < 5) {
      day.checklist.push(false);
    }

    return day;
  }

  const day = getDay();

  // ========================================
  // MOOD TRACKER
  // ========================================
  const moodButtons = [...document.querySelectorAll(".mood")];
  const moodMessage = document.getElementById("moodMessage");
  const saveMoodButton = document.getElementById("saveMood");

  function renderMood() {
    moodButtons.forEach(button => {
      const selected = button.dataset.mood === day.mood;

      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  moodButtons.forEach(button => {
    button.addEventListener("click", () => {
      day.mood = button.dataset.mood || "";

      renderMood();

      if (saveData() && moodMessage) {
        moodMessage.textContent = "Mood saved successfully! 🌿";
      }
    });
  });

  if (saveMoodButton) {
    saveMoodButton.addEventListener("click", () => {
      if (!day.mood) {
        if (moodMessage) {
          moodMessage.textContent = "Please choose your mood first.";
        }
        return;
      }

      if (saveData() && moodMessage) {
        moodMessage.textContent = "Your mood has been saved! 🌿";
      }
    });
  }

  // ========================================
  // WATER, SLEEP AND MOVEMENT TRACKERS
  // ========================================
  const waterCount = document.getElementById("waterCount");
  const sleepCount = document.getElementById("sleepCount");
  const movementCount = document.getElementById("movementCount");
  const waterProgress = document.getElementById("waterProgress");

  function updateTrackers() {
    day.water = Math.max(0, Math.min(8, Number(day.water) || 0));
    day.sleep = Math.max(0, Math.min(24, Number(day.sleep) || 0));
    day.movement = Math.max(0, Number(day.movement) || 0);

    if (waterCount) waterCount.textContent = day.water;
    if (sleepCount) sleepCount.textContent = day.sleep.toFixed(1);
    if (movementCount) movementCount.textContent = day.movement;

    if (waterProgress) {
      waterProgress.style.width = `${(day.water / 8) * 100}%`;
    }

    saveData();
  }

  document.getElementById("waterPlus")?.addEventListener("click", () => {
    day.water++;
    updateTrackers();
  });

  document.getElementById("waterMinus")?.addEventListener("click", () => {
    day.water--;
    updateTrackers();
  });

  document.getElementById("sleepPlus")?.addEventListener("click", () => {
    day.sleep += 0.5;
    updateTrackers();
  });

  document.getElementById("sleepMinus")?.addEventListener("click", () => {
    day.sleep -= 0.5;
    updateTrackers();
  });

  document.getElementById("movementPlus")?.addEventListener("click", () => {
    day.movement += 10;
    updateTrackers();
  });

  document.getElementById("movementMinus")?.addEventListener("click", () => {
    day.movement -= 10;
    updateTrackers();
  });

  // ========================================
  // DAILY SELF-CARE CHECKLIST
  // ========================================
  const checkboxes = [...document.querySelectorAll(".selfcare")];
  const checkProgress = document.getElementById("checkProgress");
  const checkProgressBar = document.getElementById("checkProgressBar");

  function updateChecklist() {
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = Boolean(day.checklist[index]);
    });

    const completed = checkboxes.filter(box => box.checked).length;
    const total = checkboxes.length;

    if (checkProgress) {
      checkProgress.textContent = `${completed} of ${total} completed`;
    }

    if (checkProgressBar) {
      checkProgressBar.style.width =
        `${total ? (completed / total) * 100 : 0}%`;
    }

    saveData();
  }

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
      day.checklist[index] = checkbox.checked;
      updateChecklist();
    });
  });

  // ========================================
  // MY WELLNESS JOURNAL
  // ========================================
  const reflectionDate = document.getElementById("reflectionDate");
  const reflectionInput = document.getElementById("reflection");
  const saveReflectionButton = document.getElementById("saveReflection");
  const reflectionMessage = document.getElementById("reflectionMessage");
  const reflectionHistory = document.getElementById("reflectionHistory");

  function loadReflections() {
    try {
      const saved = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "{}");

      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        return saved;
      }

      return {};
    } catch (error) {
      return {};
    }
  }

  let reflections = loadReflections();

  function showJournalMessage(message, isError = false) {
    if (!reflectionMessage) return;

    reflectionMessage.textContent = message;
    reflectionMessage.style.color = isError ? "#c0392b" : "#247447";
  }

  function renderReflections() {
    if (!reflectionHistory) return;

    reflectionHistory.replaceChildren();

    const dates = Object.keys(reflections)
      .filter(date =>
        typeof reflections[date] === "string" &&
        reflections[date].trim() !== ""
      )
      .sort((a, b) => b.localeCompare(a));

    if (dates.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent =
        "No reflections saved yet. Write your first reflection! 🌿";

      reflectionHistory.appendChild(emptyMessage);
      return;
    }

    dates.forEach(date => {
      const entry = document.createElement("article");
      entry.className = "reflection-entry";

      const heading = document.createElement("h4");
      heading.textContent = date;

      const content = document.createElement("p");
      content.textContent = reflections[date];

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "Edit";

      editButton.addEventListener("click", () => {
        if (reflectionDate) reflectionDate.value = date;
        if (reflectionInput) {
          reflectionInput.value = reflections[date];
          reflectionInput.focus();
        }

        showJournalMessage("Reflection loaded. You can edit and save it.");
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";

      deleteButton.addEventListener("click", () => {
        if (!window.confirm(`Delete the reflection for ${date}?`)) {
          return;
        }

        const previousReflections = { ...reflections };
        delete reflections[date];

        try {
          localStorage.setItem(JOURNAL_KEY, JSON.stringify(reflections));
          renderReflections();
          showJournalMessage("Reflection deleted successfully.");
        } catch (error) {
          reflections = previousReflections;
          renderReflections();
          showJournalMessage(
            "Unable to delete the reflection. Check browser storage.",
            true
          );
        }
      });

      entry.append(heading, content, editButton, deleteButton);
      reflectionHistory.appendChild(entry);
    });
  }

  if (reflectionDate) {
    reflectionDate.value = getLocalDate();
  }

  if (saveReflectionButton) {
    saveReflectionButton.addEventListener("click", () => {
      const date = reflectionDate?.value || "";
      const text = reflectionInput?.value.trim() || "";

      if (!date) {
        showJournalMessage("Please select a date.", true);
        reflectionDate?.focus();
        return;
      }

      if (!text) {
        showJournalMessage("Please write your reflection before saving.", true);
        reflectionInput?.focus();
        return;
      }

      const previousReflections = { ...reflections };
      reflections[date] = text;

      try {
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(reflections));
        renderReflections();
        showJournalMessage("Reflection saved successfully! 🌿");
      } catch (error) {
        reflections = previousReflections;
        showJournalMessage(
          "Unable to save. Please check your browser storage settings.",
          true
        );
      }
    });
  }

  // ========================================
  // TODAY'S DATE DISPLAY
  // ========================================
  const todayDate = document.getElementById("todayDate");

  if (todayDate) {
    todayDate.textContent = today.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short"
    });
  }

  // ========================================
  // INITIAL PAGE DISPLAY
  // ========================================
  renderMood();
  updateTrackers();
  updateChecklist();
  renderReflections();
});
