
// ========================================
// LifeSphere Dashboard JavaScript
// Login + Welcome + Date + Logout + Graph
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------------------
  // 1. Check login
  // ----------------------------------------
  const loginKey = "lifesphere-logged-in-user";
  const loggedInEmail = localStorage.getItem(loginKey);

  if (!loggedInEmail) {
    window.location.replace("login.html");
    return;
  }

  // ----------------------------------------
  // 2. Get the user's name
  // ----------------------------------------
  let savedName =
    localStorage.getItem("lifesphere-current-user-name");

  // If the name is missing, look for the account.
  if (!savedName) {
    try {
      const accounts = JSON.parse(
        localStorage.getItem("lifesphere-demo-accounts") || "[]"
      );

      const account = Array.isArray(accounts)
        ? accounts.find(function (item) {
            return (
              item &&
              item.email &&
              item.email.toLowerCase() ===
                loggedInEmail.toLowerCase()
            );
          })
        : null;

      savedName = account
        ? account.fullName || account.email
        : "User";
    } catch (error) {
      savedName = "User";
    }
  }

  // ----------------------------------------
  // 3. Display the user's name and avatar
  // ----------------------------------------
  const nameElement = document.getElementById("userName");
  const avatarElement = document.getElementById("userAvatar");
  const welcomeElement = document.getElementById("welcomeHeading");

  if (nameElement) {
    nameElement.textContent = `Welcome, ${savedName}!`;
  }

  if (avatarElement) {
    avatarElement.textContent =
      savedName.trim().charAt(0).toUpperCase() || "U";
  }

  if (welcomeElement) {
    welcomeElement.textContent =
      `Welcome to LifeSphere, ${savedName}!`;
  }

  // ----------------------------------------
  // 4. Display today's date
  // ----------------------------------------
  const todayDate = document.getElementById("todayDate");

  if (todayDate) {
    todayDate.textContent = new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );
  }

  // ----------------------------------------
  // 5. Log out
  // ----------------------------------------
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      const confirmed = window.confirm(
        "Are you sure you want to log out?"
      );

      if (!confirmed) return;

      localStorage.removeItem(loginKey);
      localStorage.removeItem("lifesphere-current-user-name");

      window.location.replace("login.html");
    });
  }

  // ----------------------------------------
  // 6. Read saved goals and tasks safely
  // ----------------------------------------
  function readArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  const goals = readArray("lifesphere-goals");
  const tasks = readArray("lifesphere-tasks");

  // ----------------------------------------
  // 7. Update dashboard summary cards
  // ----------------------------------------
  const goalsCount = document.getElementById("goalsCount");
  const tasksCount = document.getElementById("tasksCount");

  if (goalsCount) {
    goalsCount.textContent = goals.length;
  }

  if (tasksCount) {
    tasksCount.textContent = tasks.filter(function (task) {
      return !task.completed && !task.done;
    }).length;
  }

  // ----------------------------------------
  // 8. Create the progress graph
  // ----------------------------------------
  const canvas = document.getElementById("progressChart");

  if (canvas && typeof Chart !== "undefined") {
    // Count incomplete and completed tasks.
    const completedTasks = tasks.filter(function (task) {
      return task.completed === true || task.done === true;
    }).length;

    const pendingTasks = Math.max(
      0,
      tasks.length - completedTasks
    );

    // Prevent duplicate chart initialization.
    if (typeof Chart.getChart === "function") {
      const existingChart = Chart.getChart(canvas);

      if (existingChart) {
        existingChart.destroy();
      }
    }

    new Chart(canvas, {
      type: "bar",

      data: {
        labels: [
          "Goals",
          "Completed Tasks",
          "Pending Tasks"
        ],

        datasets: [{
          label: "Number of Items",

          data: [
            goals.length,
            completedTasks,
            pendingTasks
          ],

          backgroundColor: [
            "#8b75ed",
            "#38c99b",
            "#ed81b6"
          ],

          borderRadius: 10,
          maxBarThickness: 65
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: true,

        plugins: {
          legend: {
            display: false
          },

          title: {
            display: true,
            text: "Your LifeSphere Progress",
            color: "#292540",
            font: {
              size: 17,
              weight: "bold"
            }
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  } else if (canvas) {
    console.error(
      "Chart.js is not loaded. Check the Chart.js script in dashboard.html."
    );
  }
});
const canvas = document.getElementById("progressChart");

if (canvas && typeof Chart !== "undefined") {
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Goals", "Completed Tasks", "Pending Tasks"],
      datasets: [{
        label: "Your Progress",
        data: [4, 0, 1],
        backgroundColor: ["#8b75ed", "#38c99b", "#59a8f2"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
// Update Finance Summary on Dashboard
function updateFinanceSummary() {
  let transactions = [];

  try {
    transactions = JSON.parse(
      localStorage.getItem("lifesphere-finance") || "[]"
    );

    if (!Array.isArray(transactions)) {
      transactions = [];
    }
  } catch (error) {
    transactions = [];
  }

  const income = transactions
    .filter(item => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const expenses = transactions
    .filter(item => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const incomeElement = document.getElementById("financeIncome");
  const expensesElement = document.getElementById("financeExpenses");
  const balanceElement = document.getElementById("financeBalance");

  const money = amount =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(amount);

  if (incomeElement) incomeElement.textContent = money(income);
  if (expensesElement) expensesElement.textContent = money(expenses);
  if (balanceElement) balanceElement.textContent = money(income - expenses);
}
const transactions = JSON.parse(
  localStorage.getItem("lifesphere-finance") || "[]"
);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(registration => {
        console.log("LifeSphere service worker:", registration.scope);
      })
      .catch(error => {
        console.error("LifeSphere service worker error:", error);
      });
  });
}