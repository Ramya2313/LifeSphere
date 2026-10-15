
const STORAGE_KEY = "lifesphere-notes";

const noteForm = document.getElementById("noteForm");
const noteIdInput = document.getElementById("noteId");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchNotes");
const message = document.getElementById("formMessage");
const cancelEdit = document.getElementById("cancelEdit");

let notes = loadNotes();

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    message.textContent = "Could not save notes. Check browser storage.";
    return false;
  }
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function updateStats() {
  document.getElementById("totalNotes").textContent = notes.length;
  document.getElementById("ideaNotes").textContent = notes.length;

  if (!notes.length) {
    document.getElementById("lastSaved").textContent = "—";
    return;
  }

  const latest = [...notes].sort(
    (a, b) => b.updatedAt - a.updatedAt
  )[0];

  document.getElementById("lastSaved").textContent =
    new Date(latest.updatedAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    });
}

function resetEditor() {
  noteForm.reset();
  noteIdInput.value = "";
  document.getElementById("editorHeading").textContent = "✍️ Create a Note";
  document.getElementById("saveButton").textContent = "💾 Save Note";
  cancelEdit.hidden = true;
}

function renderNotes() {
  notesList.replaceChildren();

  const query = searchInput.value.trim().toLowerCase();

  const filtered = notes
    .filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.appendChild(makeElement("span", "", "🗒️"));

    empty.appendChild(makeElement(
      "h3",
      "",
      notes.length && query
        ? "No matching notes"
        : "No notes yet!"
    ));

    empty.appendChild(makeElement(
      "p",
      "",
      notes.length && query
        ? "Try a different search."
        : "Create your first note and let your ideas grow."
    ));

    notesList.appendChild(empty);
    updateStats();
    return;
  }

  filtered.forEach(note => {
    const card = document.createElement("article");
    card.className = "note-item";

    card.appendChild(makeElement("h3", "", note.title));

    card.appendChild(makeElement(
      "p",
      "note-date",
      "Updated " + new Date(note.updatedAt).toLocaleString("en-IN")
    ));

    card.appendChild(makeElement("p", "note-content", note.content));

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = makeElement("button", "note-action edit-btn", "✏️ Edit");
    editButton.type = "button";
    editButton.addEventListener("click", () => {
      noteIdInput.value = note.id;
      titleInput.value = note.title;
      contentInput.value = note.content;

      document.getElementById("editorHeading").textContent = "✏️ Edit Note";
      document.getElementById("saveButton").textContent = "💾 Update Note";
      cancelEdit.hidden = false;
      message.textContent = "";

      titleInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const deleteButton = makeElement(
      "button", "note-action delete-btn", "🗑 Delete"
    );
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      if (!confirm(`Delete the note "${note.title}"?`)) return;

      const oldNotes = notes;
      notes = notes.filter(item => item.id !== note.id);

      if (!saveNotes()) {
        notes = oldNotes;
        return;
      }

      if (noteIdInput.value === note.id) resetEditor();

      message.textContent = "Note deleted.";
      renderNotes();
    });

    actions.append(editButton, deleteButton);
    card.appendChild(actions);
    notesList.appendChild(card);
  });

  updateStats();
}

noteForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    message.textContent = "Please enter both a title and note content.";
    return;
  }

  const now = Date.now();
  const existingId = noteIdInput.value;

  if (existingId) {
    const index = notes.findIndex(note => note.id === existingId);

    if (index === -1) {
      message.textContent = "This note could not be found. Please try again.";
      return;
    }

    const oldNote = { ...notes[index] };
    notes[index] = { ...notes[index], title, content, updatedAt: now };

    if (!saveNotes()) {
      notes[index] = oldNote;
      return;
    }

    message.textContent = "Note updated successfully! ✨";
  } else {
    const note = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      title,
      content,
      createdAt: now,
      updatedAt: now
    };

    notes.unshift(note);

    if (!saveNotes()) {
      notes = notes.filter(item => item.id !== note.id);
      return;
    }

    message.textContent = "Note saved successfully! 🎉";
  }

  resetEditor();
  renderNotes();
});

cancelEdit.addEventListener("click", () => {
  resetEditor();
  message.textContent = "Editing cancelled.";
});

searchInput.addEventListener("input", renderNotes);

renderNotes();
