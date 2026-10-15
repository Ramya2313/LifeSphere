
const STORAGE_KEY = "lifesphere-contact-feedback";

const feedbackForm = document.getElementById("feedbackForm");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("charCount");
const formStatus = document.getElementById("formStatus");

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = type;
}

function loadFeedback() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

messageInput.addEventListener("input", function () {
  charCount.textContent = messageInput.value.length;
});

feedbackForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const topic = document.getElementById("topic").value;
  const rating = document.getElementById("rating").value;
  const message = messageInput.value.trim();

  if (!name || !email || !topic || !rating || !message) {
    showStatus("Please complete all fields.", "error");
    return;
  }

  if (message.length < 10) {
    showStatus("Please enter at least 10 characters in your message.", "error");
    return;
  }

  if (message.length > 1000) {
    showStatus("Your message must be 1000 characters or fewer.", "error");
    return;
  }

  const feedback = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    email,
    topic,
    rating: Number(rating),
    message,
    createdAt: new Date().toISOString()
  };

  const feedbackList = loadFeedback();
  feedbackList.unshift(feedback);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList));
    showStatus(
      "Thank you! Your feedback has been saved in this browser. 💚",
      "success"
    );

    feedbackForm.reset();
    charCount.textContent = "0";
  } catch (error) {
    showStatus(
      "Unable to save feedback. Please check your browser storage settings.",
      "error"
    );
  }
});
