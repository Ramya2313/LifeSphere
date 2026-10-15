
const financeForm = document.getElementById("financeForm");
const typeInput = document.getElementById("type");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("transactionDate");
const filterType = document.getElementById("filterType");
const transactionsList = document.getElementById("transactionsList");
const emptyMessage = document.getElementById("emptyMessage");
const message = document.getElementById("message");

const STORAGE_KEY = "lifesphere-finance";
const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

dateInput.value = todayString();

// Read transactions safely
function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

let transactions = loadTransactions();

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    message.style.color = "#d64c61";
    message.textContent = "Unable to save data in this browser.";
    return false;
  }
}

function renderSummary() {
  const income = transactions
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  document.getElementById("totalIncome").textContent =
    money.format(income);

  document.getElementById("totalExpenses").textContent =
    money.format(expenses);

  document.getElementById("balance").textContent =
    money.format(income - expenses);
}

function renderTransactions() {
  transactionsList.replaceChildren();

  const selectedType = filterType.value;

  const filtered = transactions
    .filter(item => selectedType === "all" || item.type === selectedType)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  emptyMessage.hidden = filtered.length > 0;

  if (transactions.length === 0) {
    emptyMessage.textContent =
      "No transactions yet. Add your first transaction!";
  } else if (filtered.length === 0) {
    emptyMessage.textContent = "No transactions match this filter.";
  }

  filtered.forEach(function (item) {
    const row = document.createElement("article");
    row.className = "transaction";

    const icon = document.createElement("div");
    icon.className = "transaction-icon";
    icon.textContent = item.type === "income" ? "↙" : "↗";

    const details = document.createElement("div");
    details.className = "transaction-details";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const meta = document.createElement("p");
    meta.textContent = `${item.category} · ${item.date}`;

    details.append(title, meta);

    const right = document.createElement("div");
    right.className = "transaction-right";

    const amount = document.createElement("div");
    amount.className =
      "transaction-amount " +
      (item.type === "income" ? "income-text" : "expense-text");

    amount.textContent =
      (item.type === "income" ? "+" : "−") + money.format(item.amount);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${item.title}`);

    deleteButton.addEventListener("click", function () {
      const previous = transactions;
      transactions = transactions.filter(tx => tx.id !== item.id);

      if (saveTransactions()) {
        renderAll();
        message.style.color = "#26734e";
        message.textContent = "Transaction deleted.";
      } else {
        transactions = previous;
      }
    });

    right.append(amount, deleteButton);
    row.append(icon, details, right);
    transactionsList.appendChild(row);
  });
}

function renderAll() {
  renderSummary();
  renderTransactions();
}

// Save a new transaction
financeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (!title) {
    message.style.color = "#d64c61";
    message.textContent = "Please enter a description.";
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000000) {
    message.style.color = "#d64c61";
    message.textContent = "Enter a valid amount greater than zero.";
    return;
  }

  if (!date || date > todayString()) {
    message.style.color = "#d64c61";
    message.textContent = "Please choose a valid date that is not in the future.";
    return;
  }

  const transaction = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: typeInput.value,
    title: title,
    amount: Math.round(amount * 100) / 100,
    category: categoryInput.value,
    date: date
  };

  transactions.push(transaction);

  if (!saveTransactions()) {
    transactions.pop();
    return;
  }

  financeForm.reset();
  typeInput.value = "income";
  dateInput.value = todayString();

  message.style.color = "#26734e";
  message.textContent = "Transaction added successfully!";

  renderAll();
});

filterType.addEventListener("change", renderTransactions);

renderAll();
