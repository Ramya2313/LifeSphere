
// LifeSphere Goals

const goalForm = document.getElementById("goalForm");
const goalNameInput = document.getElementById("goalName");
const targetDateInput = document.getElementById("targetDate");
const goalsList = document.getElementById("goalsList");
const goalMessage = document.getElementById("goalMessage");

const STORAGE_KEY = "lifesphere-goals";

function loadGoals() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

let goals = loadGoals();

function saveGoals() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

function renderGoals() {
  goalsList.replaceChildren();

  if (goals.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No goals yet. Add your first goal above!";
    goalsList.appendChild(emptyMessage);
    return;
  }

  goals.forEach(function (goal) {
    const item = document.createElement("div");
    item.className = "goal-item";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = goal.name;

    const date = document.createElement("p");
    date.textContent = "Target date: " + goal.targetDate;

    details.append(title, date);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function () {
      goals = goals.filter(function (savedGoal) {
        return savedGoal.id !== goal.id;
      });

      saveGoals();
      renderGoals();
    });

    item.append(details, deleteButton);
    goalsList.appendChild(item);
  });
}

goalForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = goalNameInput.value.trim();
  const targetDate = targetDateInput.value;

  if (!name || !targetDate) {
    goalMessage.textContent = "Please enter a goal name and target date.";
    return;
  }

  goals.push({
    id: Date.now().toString(),
    name: name,
    targetDate: targetDate
  });

  saveGoals();
  renderGoals();

  goalForm.reset();
  goalMessage.textContent = "Goal added successfully!";
});

renderGoals();
