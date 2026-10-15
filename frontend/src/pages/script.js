
const pageContent = document.getElementById("page-content");

let tasks = [
  { id: 1, name: "Complete project documentation", done: false },
  { id: 2, name: "Study JavaScript", done: false },
  { id: 3, name: "Finish LifeSphere UI", done: true }
];

let goals = [
  { id: 1, name: "Complete LifeSphere project", done: false },
  { id: 2, name: "Learn JavaScript", done: false }
];

let nextId = 4;

function showPage(page) {
  document.querySelectorAll("nav button").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  if (page === "Dashboard") {
    renderDashboard();
  } else if (page === "Tasks") {
    renderList("Tasks", tasks);
  } else if (page === "Goals") {
    renderList("Goals", goals);
  } else {
    const descriptions = {
      Calendar: "Plan your important events and dates.",
      Wellness: "Track your daily health and wellness.",
      Study: "Organize your subjects and learning goals.",
      Notes: "Keep your ideas and notes in one place.",
      Finance: "Track your income and expenses.",
      Contact: "Contact us with your feedback.",
      Profile: "Manage your personal information.",
      Settings: "Customize your LifeSphere experience."
    };

    pageContent.innerHTML = `
      <h1>${page}</h1>
      <p>${descriptions[page] || "Welcome to LifeSphere."}</p>
      <button id="back-home">← Dashboard</button>
    `;

    document.getElementById("back-home").onclick =
      () => showPage("Dashboard");
  }
}

function renderDashboard() {
  pageContent.innerHTML = `
    <h1>Good morning, Ramya! 🌞</h1>
    <p>Small steps every day make big changes.</p>

    <div class="stats">
      <article><h3>🎯 Goals</h3>
        <strong>${goals.filter(g => !g.done).length}</strong>
        <p>Active goals</p></article>
      <article><h3>☑️ Tasks</h3>
        <strong>${tasks.filter(t => !t.done).length}</strong>
        <p>Remaining tasks</p></article>
      <article><h3>📅 Events</h3>
        <strong>4</strong><p>Upcoming</p></article>
      <article><h3>💚 Wellness</h3>
        <strong>80%</strong><p>Wellness score</p></article>
    </div>

    <h2>Today's Tasks</h2>
    <div id="dashboard-tasks"></div>
    <button id="add-task">+ Add Task</button>
  `;

  renderTaskItems(document.getElementById("dashboard-tasks"));

  document.getElementById("add-task").onclick = () => {
    const name = prompt("Enter your task:");
    if (name && name.trim()) {
      tasks.push({ id: nextId++, name: name.trim(), done: false });
      showPage("Dashboard");
    }
  };
}

function renderList(page, items) {
  pageContent.innerHTML = `
    <h1>${page}</h1>
    <p>Manage your ${page.toLowerCase()} here.</p>
    <form id="item-form">
      <input id="item-name" placeholder="Enter a ${page === "Goals" ? "goal" : "task"}" required>
      <button type="submit">+ Add</button>
    </form>
    <div id="item-list"></div>
    <button id="back-home">← Dashboard</button>
  `;

  document.getElementById("item-form").onsubmit = event => {
    event.preventDefault();
    const input = document.getElementById("item-name");
    items.push({ id: nextId++, name: input.value.trim(), done: false });
    showPage(page);
  };

  document.getElementById("back-home").onclick =
    () => showPage("Dashboard");

  renderTaskItems(document.getElementById("item-list"), items);
}

function renderTaskItems(container, items = tasks) {
  container.replaceChildren();

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "task";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = item.done;
    check.onchange = () => {
      item.done = check.checked;
      const activePage = document.querySelector("nav button.active");
      showPage(activePage?.dataset.page || "Dashboard");
    };

    const label = document.createElement("span");
    label.textContent = " " + item.name;
    if (item.done) label.style.textDecoration = "line-through";

    const remove = document.createElement("button");
    remove.textContent = " Delete";
    remove.onclick = () => {
      const index = items.indexOf(item);
      if (index !== -1) items.splice(index, 1);
      const activePage = document.querySelector("nav button.active");
      showPage(activePage?.dataset.page || "Dashboard");
    };

    row.append(check, label, remove);
    container.appendChild(row);
  });
}

document.querySelectorAll("nav button").forEach(button => {
  button.onclick = () => showPage(button.dataset.page);
});

showPage("Dashboard");
