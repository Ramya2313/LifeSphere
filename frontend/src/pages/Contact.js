
"use strict";

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const topicInput = document.getElementById("topic");
const messageInput = document.getElementById("message");

const formStatus = document.getElementById("formStatus");
const characterCount = document.getElementById("characterCount");

const STORAGE_KEY = "lifesphere-contact-messages";

// Update the message character count.
messageInput.addEventListener("input", function () {
  characterCount.textContent = messageInput.value.length;
});

// Display form feedback.
function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = "form-status " + type;
}

// Validate and save the message locally.
contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const topic = topicInput.value;
  const message = messageInput.value.trim();

  if (!name) {
    showStatus("Please enter your name.", "error");
    nameInput.focus();
    return;
  }

  if (!emailInput.validity.valid || !email) {
    showStatus("Please enter a valid email address.", "error");
    emailInput.focus();
    return;
  }

  if (!topic) {
    showStatus("Please choose a message topic.", "error");
    topicInput.focus();
    return;
  }

  if (message.length < 10) {
    showStatus("Please enter at least 10 characters in your message.", "error");
    messageInput.focus();
    return;
  }

  if (message.length > 2000) {
    showStatus("Your message must be 2000 characters or fewer.", "error");
    messageInput.focus();
    return;
  }

  const contactMessage = {
    id: Date.now().toString(),
    name: name,
    email: email,
    topic: topic,
    message: message,
    submittedAt: new Date().toISOString()
  };

  let savedMessages = [];

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(existing)) {
      throw new Error("Stored message data is invalid.");
    }

    savedMessages = existing;
    savedMessages.push(contactMessage);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedMessages)
    );

    showStatus(
      "Thank you, " + name + "! Your message has been saved in this browser. " +
      "This demo does not send an email.",
      "success"
    );

    contactForm.reset();
    characterCount.textContent = "0";
  } catch (error) {
    showStatus(
      "Unable to save your message. Check your browser storage settings.",
      "error"
    );
  }
});
