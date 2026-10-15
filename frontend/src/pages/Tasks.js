
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem("lifesphere-tasks") || "[]");
  if (!Array.isArray(tasks)) tasks = [];
} catch (error) {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("lifesphere-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  emptyMessage.style.display = tasks.length ? "none" : "block";

  tasks.forEach(function (task) {
    const card = document.createElement("article");
    card.className = task.completed ? "task completed" : "task";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const date = document.createElement("p");
    date.textContent = "Due date: " + task.date;

    const priority = document.createElement("p");
    priority.textContent = "Priority: " + task.priority;

    const status = document.createElement("p");
    status.textContent = task.completed ? "Status: Completed" : "Status: Pending";

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Mark Pending" : "Complete";
    completeButton.addEventListener("click", function () {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";
    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (item) {
        return item.id !== task.id;
      });
      saveTasks();
      renderTasks();
    });

    actions.append(completeButton, deleteButton);
    card.append(title, date, priority, status, actions);
    taskList.appendChild(card);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  tasks.push({
    id: Date.now().toString() + Math.random().toString(16).slice(2),
    title: taskTitle.value.trim(),
    date: taskDate.value,
    priority: taskPriority.value,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskPriority.value = "Medium";
});

renderTasks();
