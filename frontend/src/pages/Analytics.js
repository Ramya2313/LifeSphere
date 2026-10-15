
const MODULES = [
  {
    id: "dashboard",
    title: "Dashboard",
    keys: ["lifesphere-dashboard"],
    words: ["dashboard"]
  },
  {
    id: "goals",
    title: "Goals",
    keys: ["lifesphere-goals", "lifesphere-goals-v1"],
    words: ["goal"]
  },
  {
    id: "tasks",
    title: "Tasks",
    keys: ["lifesphere-tasks", "lifesphere-tasks-v1"],
    words: ["task", "todo"]
  },
  {
    id: "calendar",
    title: "Calendar",
    keys: ["lifesphere-calendar", "lifesphere-events"],
    words: ["calendar", "event"]
  },
  {
    id: "wellness",
    title: "Health & Wellness",
    keys: ["lifesphere-wellness", "lifesphere-moods", "lifesphere-habits"],
    words: ["wellness", "mood", "habit", "health"]
  },
  {
    id: "study",
    title: "Study Planner",
    keys: [
      "lifesphere-study-tasks",
      "lifesphere-study-tasks-v1",
      "lifesphere-study-sessions-v1"
    ],
    words: ["study", "learning", "session"]
  },
  {
    id: "notes",
    title: "Notes",
    keys: ["lifesphere-notes", "lifesphere-notes-v1"],
    words: ["note"]
  },
  {
    id: "finance",
    title: "Finance",
    keys: ["lifesphere-finance"],
    words: ["finance", "transaction"]
  },
  {
    id: "contact",
    title: "Contact",
    keys: ["lifesphere-contact-messages"],
    words: ["contact", "feedback", "message"]
  },
  {
    id: "profile",
    title: "Profile",
    keys: ["lifesphere-profile"],
    words: ["profile", "user-profile"]
  },
  {
    id: "analytics",
    title: "Analytics",
    keys: [],
    words: ["analytics"]
  },
  {
    id: "settings",
    title: "Settings",
    keys: ["lifesphere-settings"],
    words: ["settings", "preferences", "theme"]
  }
];

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStorageEntries() {
  const entries = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    entries.push({
      key,
      value: safeParse(localStorage.getItem(key) || "")
    });
  }

  return entries;
}

function matchesModule(entry, module) {
  const key = entry.key.toLowerCase();

  if (module.keys.some(item => key === item.toLowerCase())) {
    return true;
  }

  // Do not count login/account entries as profile or general activity.
  if (
    key.includes("password") ||
    key.includes("logged-in") ||
    key.includes("demo-accounts") ||
    key.includes("auth")
  ) {
    return false;
  }

  return module.words.some(word => key.includes(word));
}

function getModuleEntries(module, entries) {
  return entries.filter(entry => matchesModule(entry, module));
}

function getRecords(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  // Common storage patterns used by web apps.
  for (const property of [
    "items", "data", "records", "tasks", "goals",
    "events", "notes", "transactions", "sessions",
    "habits", "moods", "messages"
  ]) {
    if (Array.isArray(value[property])) {
      return value[property];
    }
  }

  return [];
}

function getAllRecords(entries) {
  const records = [];

  entries.forEach(entry => {
    const value = entry.value;

    if (Array.isArray(value)) {
      records.push(...value);
    } else if (value && typeof value === "object") {
      records.push(...getRecords(value));
    }
  });

  return records;
}

function isCompleted(item) {
  if (!item || typeof item !== "object") return false;

  return item.completed === true ||
    item.done === true ||
    item.isCompleted === true ||
    item.status === "completed" ||
    item.status === "complete" ||
    item.status === "done";
}

function countRecords(module, entries) {
  const matched = getModuleEntries(module, entries);
  return getAllRecords(matched).length;
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

function updateText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function updateModuleCards(entries) {
  const cards = document.querySelectorAll(".module-card");

  cards.forEach((card, index) => {
    const module = MODULES[index];
    if (!module) return;

    if (module.id === "analytics") {
      card.querySelector("strong").textContent = "Report available";
      return;
    }

    if (module.id === "dashboard") {
      card.querySelector("strong").textContent =
        "Summary of workspace data";
      return;
    }

    const matchedEntries = getModuleEntries(module, entries);
    const recordCount = countRecords(module, entries);
    const strong = card.querySelector("strong");

    if (!strong) return;

    if (matchedEntries.length === 0) {
      strong.textContent = "No matching saved data found";
    } else if (module.id === "settings" || module.id === "profile") {
      strong.textContent =
        `${matchedEntries.length} saved item(s) detected`;
    } else {
      strong.textContent =
        `${recordCount} record(s) detected`;
    }
  });
}

function updateFinance(entries) {
  const financeModule = MODULES.find(item => item.id === "finance");
  const financeEntries = getModuleEntries(financeModule, entries);
  const transactions = getAllRecords(financeEntries);

  const income = transactions
    .filter(item => item && item.type === "income")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const expenses = transactions
    .filter(item => item && item.type === "expense")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  updateText("income", money(income));
  updateText("expenses", money(expenses));
  updateText("balance", money(income - expenses));
}

function updateTaskProgress(entries) {
  const taskModule = MODULES.find(item => item.id === "tasks");
  const taskEntries = getModuleEntries(taskModule, entries);
  const tasks = getAllRecords(taskEntries);

  const completed = tasks.filter(isCompleted).length;
  const total = tasks.length;
  const percentage = total ? Math.round(completed / total * 100) : 0;

  const progress = document.getElementById("taskProgress");
  if (progress) progress.style.width = `${percentage}%`;

  updateText(
    "taskProgressText",
    total
      ? `Task completion: ${completed} of ${total} (${percentage}%).`
      : "Task completion: no task records found under recognized storage keys."
  );
}

function updateReport() {
  const entries = getStorageEntries();

  const goalModule = MODULES.find(item => item.id === "goals");
  const taskModule = MODULES.find(item => item.id === "tasks");
  const studyModule = MODULES.find(item => item.id === "study");
  const notesModule = MODULES.find(item => item.id === "notes");

  const goals = getAllRecords(getModuleEntries(goalModule, entries));
  const tasks = getAllRecords(getModuleEntries(taskModule, entries));
  const study = getAllRecords(getModuleEntries(studyModule, entries));
  const notes = getAllRecords(getModuleEntries(notesModule, entries));

  const completedGoals = goals.filter(isCompleted).length;
  const completedTasks = tasks.filter(isCompleted).length;

  updateText("goalsTotal", goals.length);
  updateText(
    "goalsDetail",
    goals.length
      ? `${completedGoals} marked completed`
      : "No goal records found"
  );

  updateText("tasksTotal", tasks.length);
  updateText(
    "tasksDetail",
    tasks.length
      ? `${completedTasks} completed · ${tasks.length - completedTasks} not marked complete`
      : "No task records found"
  );

  updateText("studyTotal", study.length);
  updateText(
    "studyDetail",
    study.length ? "Study-related records detected" : "No study records found"
  );

  updateText("notesTotal", notes.length);
  updateText(
    "notesDetail",
    notes.length ? "Note-related records detected" : "No note records found"
  );

  updateModuleCards(entries);
  updateFinance(entries);
  updateTaskProgress(entries);

  const modulesWithData = MODULES.filter(module =>
    module.id !== "dashboard" &&
    module.id !== "analytics" &&
    getModuleEntries(module, entries).length > 0
  ).length;

  updateText(
    "overallSummary",
    `Found matching saved data for ${modulesWithData} of the 10 other workspace modules. ` +
    `Detected ${goals.length} goals, ${tasks.length} tasks, ` +
    `${study.length} study records and ${notes.length} notes. ` +
    `Counts depend on each page's storage format.`
  );

  const storageList = document.getElementById("storageList");
  if (storageList) {
    storageList.replaceChildren();

    if (entries.length === 0) {
      const item = document.createElement("li");
      item.textContent = "No localStorage entries found.";
      storageList.appendChild(item);
    } else {
      entries.forEach(entry => {
        const item = document.createElement("li");
        item.textContent = entry.key;
        storageList.appendChild(item);
      });
    }
  }

  updateText(
    "reportStatus",
    `Report refreshed. ${entries.length} browser storage key(s) detected. ` +
    "Only saved browser data is inspected; nothing is uploaded."
  );
}

document.getElementById("refreshButton")
  .addEventListener("click", updateReport);

document.getElementById("showStorageButton")
  .addEventListener("click", function () {
    const list = document.getElementById("storageList");
    list.hidden = !list.hidden;
    this.textContent = list.hidden
      ? "Show detected storage keys"
      : "Hide detected storage keys";
  });

updateReport();
