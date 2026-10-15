
// LifeSphere Study Planner

const STORAGE_KEY = "lifesphere-study-tasks";
const SESSION_KEY = "lifesphere-study-sessions";

const form = document.getElementById("studyForm");
const taskName = document.getElementById("taskName");
const subject = document.getElementById("subject");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const taskFilter = document.getElementById("taskFilter");
const formMessage = document.getElementById("formMessage");

let tasks = loadTasks();
let selectedMinutes = 25;
let secondsRemaining = selectedMinutes * 60;
let timerInterval = null;
let sessionsToday = loadSessions();

function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    formMessage.textContent = "Could not save tasks. Check browser storage.";
    return false;
  }
}

function loadSessions() {
  try {
    const data = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
    const today = new Date().toLocaleDateString("en-CA");

    if (data.date !== today) {
      return { date: today, count: 0 };
    }

    return {
      date: today,
      count: Number(data.count) || 0
    };
  } catch {
    return {
      date: new Date().toLocaleDateString("en-CA"),
      count: 0
    };
  }
}

function saveSessions() {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionsToday));
  } catch {
    // The timer still works if browser storage is unavailable.
  }
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  const remaining = tasks.length - completed;

  document.getElementById("completedCount").textContent = completed;
  document.getElementById("remainingCount").textContent = remaining;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("sessionsCount").textContent =
    sessionsToday.count;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function renderTasks() {
  taskList.replaceChildren();

  const filter = taskFilter.value;

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "remaining") return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";

    empty.appendChild(createElement("span", "", "📚"));
    empty.appendChild(createElement(
      "h3",
      "",
      filter === "completed"
        ? "No completed tasks yet!"
        : filter === "remaining"
          ? "All caught up!"
          : "Your study journey starts here!"
    ));

    empty.appendChild(createElement(
      "p",
      "",
      filter === "remaining"
        ? "Add a task or enjoy your progress."
        : "Add your first study task to get started."
    ));

    taskList.appendChild(empty);
    updateStats();
    return;
  }

  filteredTasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "task-item" + (task.completed ? " done" : "");

    const top = document.createElement("div");
    top.className = "task-top";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task completed");

    checkbox.addEventListener("change", () => {
      const previous = task.completed;
      task.completed = checkbox.checked;

      if (!saveTasks()) {
        task.completed = previous;
      }

      renderTasks();
    });

    const info = document.createElement("div");
    info.className = "task-info";

    info.appendChild(createElement("h3", "", task.name));

    info.appendChild(createElement(
      "p",
      "task-meta",
      `${task.subject} • Due: ${task.dueDate || "No due date"}`
    ));

    info.appendChild(createElement(
      "span",
      "priority " + task.priority,
      task.priority + " priority"
    ));

    top.appendChild(checkbox);
    top.appendChild(info);
    card.appendChild(top);

    const deleteButton = createElement("button", "delete-btn", "🗑 Delete");
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      if (!confirm(`Delete "${task.name}"?`)) return;

      const previousTasks = tasks;
      tasks = tasks.filter(item => item.id !== task.id);

      if (!saveTasks()) {
        tasks = previousTasks;
      }

      renderTasks();
    });

    card.appendChild(deleteButton);
    taskList.appendChild(card);
  });

  updateStats();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = taskName.value.trim();

  if (!name || !subject.value) {
    formMessage.textContent = "Please enter a task name and subject.";
    return;
  }

  const task = {
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    name,
    subject: subject.value,
    priority: priority.value,
    dueDate: dueDate.value,
    completed: false
  };

  tasks.unshift(task);

  if (!saveTasks()) {
    tasks.shift();
    return;
  }

  form.reset();
  formMessage.textContent = "Study task added successfully! 🎉";
  renderTasks();
});

taskFilter.addEventListener("change", renderTasks);

// Focus timer
const timerDisplay = document.getElementById("timerDisplay");
const timerMessage = document.getElementById("timerMessage");
const startButton = document.getElementById("startTimer");
const resetButton = document.getElementById("resetTimer");
const timeOptions = document.querySelectorAll(".time-option");

function displayTime() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  startButton.textContent = "▶ Start Studying";
}

function resetTimer() {
  stopTimer();
  secondsRemaining = selectedMinutes * 60;
  displayTime();
  timerMessage.textContent = "Ready when you are!";
}

timeOptions.forEach(button => {
  button.addEventListener("click", () => {
    if (timerInterval !== null) return;

    selectedMinutes = Number(button.dataset.minutes);

    timeOptions.forEach(option => {
      option.classList.toggle("active", option === button);
    });

    resetTimer();
  });
});

startButton.addEventListener("click", () => {
  if (timerInterval !== null) {
    stopTimer();
    timerMessage.textContent = "Timer paused. Resume when ready!";
    return;
  }

  if (secondsRemaining <= 0) {
    resetTimer();
  }

  startButton.textContent = "⏸ Pause";
  timerMessage.textContent = "You're doing great. Keep focusing! 🌱";

  timerInterval = setInterval(() => {
    secondsRemaining--;
    displayTime();

    if (secondsRemaining <= 0) {
      stopTimer();
      timerMessage.textContent = "Focus session complete! Well done! 🎉";

      sessionsToday.count++;
      saveSessions();
      updateStats();

      alert("🎉 Great job! Your study session is complete.");
    }
  }, 1000);
});

resetButton.addEventListener("click", resetTimer);

renderTasks();
displayTime();
