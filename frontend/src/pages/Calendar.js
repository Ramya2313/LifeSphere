
const STORAGE_KEY = "lifesphere-calendar-events";

const monthTitle = document.getElementById("monthTitle");
const calendarDays = document.getElementById("calendarDays");
const selectedDateText = document.getElementById("selectedDate");
const eventForm = document.getElementById("eventForm");
const eventNameInput = document.getElementById("eventName");
const eventDateInput = document.getElementById("eventDate");
const eventTimeInput = document.getElementById("eventTime");
const eventMessage = document.getElementById("eventMessage");
const eventsList = document.getElementById("eventsList");
const showAllCheckbox = document.getElementById("showAllEvents");

const today = new Date();
today.setHours(0, 0, 0, 0);

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function prettyDate(key) {
  return parseDate(key).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function loadEvents() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let events = loadEvents();
let selectedDate = dateKey(today);
let displayedMonth = new Date(
  today.getFullYear(),
  today.getMonth(),
  1
);

eventDateInput.value = selectedDate;

function saveEvents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch {
    eventMessage.textContent =
      "Unable to save. Check your browser storage settings.";
    eventMessage.style.color = "#c0392b";
    return false;
  }
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  monthTitle.textContent = displayedMonth.toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );

  calendarDays.replaceChildren();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstWeekday; i++) {
    const blank = document.createElement("div");
    blank.className = "day empty";
    blank.setAttribute("aria-hidden", "true");
    calendarDays.appendChild(blank);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day));
    const button = document.createElement("button");

    button.type = "button";
    button.className = "day";
    button.textContent = day;
    button.setAttribute("aria-label", prettyDate(key));

    if (key === dateKey(today)) button.classList.add("today");
    if (key === selectedDate) button.classList.add("selected");

    if (events.some(item => item.date === key)) {
      button.classList.add("has-event");
    }

    button.addEventListener("click", () => {
      selectedDate = key;
      eventDateInput.value = key;
      eventMessage.textContent = "";
      renderCalendar();
      renderSelectedDate();
      renderEvents();
    });

    calendarDays.appendChild(button);
  }
}

function renderSelectedDate() {
  selectedDateText.textContent =
    `📅 Selected date: ${prettyDate(selectedDate)}`;
}

function renderEvents() {
  eventsList.replaceChildren();

  const visibleEvents = events
    .filter(item => showAllCheckbox.checked || item.date === selectedDate)
    .sort((a, b) => {
      const dateOrder = a.date.localeCompare(b.date);
      return dateOrder || (a.time || "").localeCompare(b.time || "");
    });

  if (visibleEvents.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";

    const title = document.createElement("strong");
    title.textContent = showAllCheckbox.checked
      ? "📌 No events saved yet."
      : "📌 No events for this date.";

    const description = document.createElement("p");
    description.textContent =
      "Add your first event to remember what matters.";

    empty.append(title, description);
    eventsList.appendChild(empty);
    return;
  }

  visibleEvents.forEach(item => {
    const row = document.createElement("article");
    row.className = "event-item";

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.name;

    const details = document.createElement("p");
    details.textContent =
      `${prettyDate(item.date)}${item.time ? " · " + item.time : ""}`;

    info.append(title, details);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${item.name}`);

    deleteButton.addEventListener("click", () => {
      const oldEvents = events;
      events = events.filter(event => event.id !== item.id);

      if (saveEvents()) {
        eventMessage.textContent = "Event deleted successfully.";
        eventMessage.style.color = "#247447";
        renderCalendar();
        renderEvents();
      } else {
        events = oldEvents;
      }
    });

    row.append(info, deleteButton);
    eventsList.appendChild(row);
  });
}

document.getElementById("prevMonth").addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() - 1);
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() + 1);
  renderCalendar();
});

eventForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = eventNameInput.value.trim();
  const date = eventDateInput.value;
  const time = eventTimeInput.value;

  if (!name || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    eventMessage.textContent = "Please enter an event name and date.";
    eventMessage.style.color = "#c0392b";
    return;
  }

  const newEvent = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    date,
    time
  };

  events.push(newEvent);

  if (!saveEvents()) {
    events.pop();
    return;
  }

  selectedDate = date;
  const selected = parseDate(date);
  displayedMonth = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    1
  );

  eventNameInput.value = "";
  eventTimeInput.value = "";
  showAllCheckbox.checked = false;

  eventMessage.textContent = "Event saved successfully! ✨";
  eventMessage.style.color = "#247447";

  renderCalendar();
  renderSelectedDate();
  renderEvents();
});

showAllCheckbox.addEventListener("change", renderEvents);

renderCalendar();
renderSelectedDate();
renderEvents();
