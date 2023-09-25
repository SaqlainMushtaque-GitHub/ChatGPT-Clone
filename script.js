// Get DOM elements
const chatInput = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");
// Initialize variables
let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
  // Load saved chats and theme from local storage and apply/add on the page
  const themeColor = localStorage.getItem("themeColor");
  document.body.classList.toggle("light-mode", themeColor === "light-mode");
  themeBtn.innerHTML = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light-mode";
  const defaultText = `<div class="default-text">
                          <h1>ChatGPT Clone</h1>
                          <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                      </div>`;
  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to bottom of the chat container
};
const createChatElement = (content, className) => {
  // Create new div and apply chat, specified class and set html content of div
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv; // Return the created chat div
};
const getChatResponse = async (incomingChatDiv) => {
  const API_URL = "https://api.openai.com/v1/completions";
  const pElement = document.createElement("p");
  // Define the properties and data for the API request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: userText,
      max_tokens: 2048,
      temperature: 0.2,
      n: 1,
      stop: null,
    }),
  };
  // Send POST request to API, get response and set the reponse as paragraph element text
  try {
    const response = await (await fetch(API_URL, requestOptions)).json();
    pElement.textContent = response.choices[0].text.trim();
  } catch (error) {
    // Add error class to the paragraph element and set error text
    pElement.classList.add("error");
    pElement.textContent =
      "Oops! Something went wrong while retrieving the response. Please try again.";
  }
  // Remove the typing animation, append the paragraph element and save the chats to local storage
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  localStorage.setItem("all-chats", chatContainer.innerHTML);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
const copyResponse = (copyBtn) => {
  // Copy the text content of the response to the clipboard
  const reponseTextElement =
    copyBtn.parentElement.querySelector(".chat-details p");
  if (reponseTextElement !== null) {
  }
  navigator.clipboard.writeText(reponseTextElement.textContent);
  copyBtn.textContent = "done";
  setTimeout(() => (copyBtn.textContent = "content_copy"), 1000);
};
const showTypingAnimation = () => {
  // Display the typing animation and call the getChatResponse function
  const html = `<div class="chat-content">
                  <div class="chat-details">
                      <img src="images/chatbot.jpg" alt="chatbot-img">
                      <div class="typing-animation">
                          <div class="typing-dot" style="--delay: 0.2s"></div>
                          <div class="typing-dot" style="--delay: 0.3s"></div>
                          <div class="typing-dot" style="--delay: 0.4s"></div>
                      </div>
                  </div>
                  <span onclick="copyResponse(this)" class="material-symbols-outlined">content_copy</span>
              </div>`;
  // Create an incoming chat div with typing animation and append it to chat container
  const incomingChatDiv = createChatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};
const handleOutgoingChat = () => {
  userText = chatInput.value.trim(); // Get chatInput value and remove extra spaces
  if (!userText) return; // If chatInput is empty return from here
  // Clear the input field and reset its height
  chatInput.value = "";
  chatInput.style.height = `${initialHeight}px`;
  const html = `<div class="chat-content">
                  <div class="chat-details">
                      <img src="images/user.jpg" alt="user-img">
                      <p></p>
                  </div>
              </div>`;
  // Create an outgoing chat div with user's message and append it to chat container
  const outgoingChatDiv = createChatElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 500);
};

chatInput.addEventListener("input", () => {
  // adjust the Height of the input filed dynamically based on its content
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // Check whether enter key was pressed or not
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleOutgoingChat();
  }
});

themeBtn.addEventListener("click", () => {
  //Toggle body's class for theme mode and save the updated theme to the local storage
  document.body.classList.toggle("light-mode");
  localStorage.setItem("themeColor", themeBtn.innerText);
  themeBtn.innerHTML = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light-mode";
});

deleteBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all chats?")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
});

loadDataFromLocalstorage();
sendBtn.addEventListener("click", handleOutgoingChat);
