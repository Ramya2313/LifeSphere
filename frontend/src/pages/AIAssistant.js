
document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");
  const clearButton = document.getElementById("clearChat");
  const sendButton = document.getElementById("sendButton");
  const suggestionButtons = document.querySelectorAll("[data-prompt]");

  const initialMessage =
    "Hello! 👋 Welcome to LifeSphere. I can help you explore study tips, budgeting ideas, wellness habits, and goal planning. What would you like help with today?";

  let isReplying = false;
  let replyTimer = null;

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.className =
      sender === "user"
        ? "message user-message"
        : "message assistant-message";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "user" ? "👤" : "🤖";

    const content = document.createElement("div");
    content.className = "message-content";

    const label = document.createElement("p");
    label.className = "message-label";
    label.textContent =
      sender === "user" ? "You" : "LifeSphere Assistant";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    content.appendChild(label);
    content.appendChild(bubble);
    message.appendChild(avatar);
    message.appendChild(content);
    chatMessages.appendChild(message);

    scrollToBottom();
  }

  function showTyping() {
    const message = document.createElement("div");
    message.className = "message assistant-message";
    message.id = "typingIndicator";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "🤖";

    const bubble = document.createElement("div");
    bubble.className = "bubble typing-bubble";
    bubble.textContent = "Thinking...";

    message.appendChild(avatar);
    message.appendChild(bubble);
    chatMessages.appendChild(message);

    scrollToBottom();
  }

  function removeTyping() {
    const indicator = document.getElementById("typingIndicator");

    if (indicator) {
      indicator.remove();
    }
  }

  function getReply(input) {
    const text = input.toLowerCase();

    if (/\b(hi|hello|hey|good morning|good evening)\b/.test(text)) {
      return "Hello! 😊 I'm here to help you make small, positive steps. Would you like to discuss studying, finances, wellness, or goals?";
    }

    if (/study|exam|learn|homework|subject|revision|focus/.test(text)) {
      return "📚 Here are some study tips:\n\n1. Choose one small task to begin with.\n2. Study for 25 minutes, then take a 5-minute break.\n3. Keep your phone away while studying.\n4. Write down what you learned at the end of each session.\n\nConsistency matters more than perfection!";
    }

    if (/budget|money|saving|save money|expense|finance|income|spend/.test(text)) {
      return "💰 Try these budgeting habits:\n\n1. Record your income and expenses.\n2. Separate needs from wants.\n3. Set a realistic savings target.\n4. Review your spending once a week.\n\nYou can use the LifeSphere Finance page to record transactions. These are general tips, not personalized financial advice.";
    }

    if (/wellness|stress|relax|mental|mood|healthy|self.?care|tired/.test(text)) {
      return "🌿 Here are a few gentle wellness ideas:\n\n1. Take short breaks during the day.\n2. Drink water regularly.\n3. Make time for movement and rest.\n4. Write down how you feel.\n5. Reach out to someone you trust when you need support.\n\nChoose one small habit to try today.";
    }

    if (/goal|plan|motivat|achieve|habit|routine|productiv/.test(text)) {
      return "🎯 Let's make your goal manageable:\n\n1. Write down one clear goal.\n2. Break it into small steps.\n3. Choose the first step you can do today.\n4. Set a reminder to review your progress.\n5. Celebrate each completed step.\n\nWhat is one goal you'd like to work on?";
    }

    if (/time|schedule|routine|organize|organise/.test(text)) {
      return "⏰ Try this simple daily planning method:\n\n1. Choose your three most important tasks.\n2. Give each task a realistic time slot.\n3. Include breaks and free time.\n4. Start with the most important or easiest task.\n5. Review your day before bed.\n\nKeep your schedule flexible rather than trying to make every minute perfect.";
    }

    if (/thank/.test(text)) {
      return "You're welcome! 💚 Keep taking those small steps. I'm happy to help you explore ideas whenever you need.";
    }

    if (/help/.test(text)) {
      return "Of course! 😊 I can share general suggestions about:\n\n📚 Study planning\n💰 Budgeting habits\n🌿 Wellness routines\n🎯 Goals and productivity\n⏰ Time management\n\nTell me which topic you'd like to explore.";
    }

    return "Thanks for your question! 💜 This demo assistant uses predefined responses, so I may not understand every question yet. Try asking about study tips, budgeting, wellness, goal planning, or time management.";
  }

  function setReplying(value) {
    isReplying = value;
    sendButton.disabled = value;
    userInput.disabled = value;

    document.querySelectorAll("[data-prompt]").forEach(function (button) {
      button.disabled = value;
    });
  }

  function sendMessage(text) {
    const message = text.trim();

    if (!message || isReplying || message.length > 1000) {
      return;
    }

    addMessage(message, "user");
    userInput.value = "";
    userInput.style.height = "auto";

    setReplying(true);
    showTyping();

    replyTimer = window.setTimeout(function () {
      removeTyping();
      addMessage(getReply(message), "assistant");
      setReplying(false);
      userInput.focus();
      replyTimer = null;
    }, 500);
  }

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sendMessage(userInput.value);
  });

  userInput.addEventListener("input", function () {
    userInput.style.height = "auto";
    userInput.style.height =
      Math.min(userInput.scrollHeight, 120) + "px";
  });

  userInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (chatForm.requestSubmit) {
        chatForm.requestSubmit();
      } else {
        sendMessage(userInput.value);
      }
    }
  });

  suggestionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      sendMessage(button.dataset.prompt || "");
    });
  });

  clearButton.addEventListener("click", function () {
    if (replyTimer !== null) {
      window.clearTimeout(replyTimer);
      replyTimer = null;
    }

    removeTyping();
    setReplying(false);
    chatMessages.replaceChildren();
    addMessage(initialMessage, "assistant");
    userInput.value = "";
    userInput.style.height = "auto";
    userInput.focus();
  });
});
