class ChatWidget {
  static init(config) {
    if (!config.clientId || !config.apiEndpoint) {
      console.error("ChatWidget: clientId and apiEndpoint are required");
      return;
    }

    // Create and inject CSS
    const style = document.createElement("style");
    style.textContent = `
      #chat-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #chat-widget-window {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: none;
        overflow: hidden;
      }
      #chat-widget-header {
        background: #2563eb;
        color: white;
        padding: 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #chat-widget-messages {
        padding: 16px;
        height: calc(100% - 120px);
        overflow-y: auto;
      }
      .chat-message {
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        max-width: 80%;
        word-wrap: break-word;
      }
      .chat-message.bot {
        background: #f3f4f6;
      }
      .chat-message.user {
        background: #dbeafe;
        margin-left: auto;
      }
      #chat-widget-input {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
        background: white;
        border-top: 1px solid #e5e7eb;
      }
      #chat-widget-input-container {
        display: flex;
        gap: 8px;
      }
      #chat-widget-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        outline: none;
        font-size: 14px;
      }
      #chat-widget-input button {
        background: #2563eb;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
      }
      #chat-widget-button {
        width: 56px;
        height: 56px;
        background: #2563eb;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(37, 99, 235, 0.3);
        transition: transform 0.2s;
      }
      #chat-widget-button:hover {
        transform: scale(1.05);
      }
      .chat-loading {
        display: flex;
        gap: 4px;
        padding: 12px;
      }
      .chat-loading div {
        width: 8px;
        height: 8px;
        background: #94a3b8;
        border-radius: 50%;
        animation: loading 1s infinite;
      }
      .chat-loading div:nth-child(2) { animation-delay: 0.2s; }
      .chat-loading div:nth-child(3) { animation-delay: 0.4s; }
      @keyframes loading {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(style);

    // Create chat widget HTML
    const widget = document.createElement("div");
    widget.id = "chat-widget-container";
    widget.innerHTML = `
      <div id="chat-widget-window">
        <div id="chat-widget-header">
          <span>Chat Support</span>
          <button onclick="ChatWidget.toggle()" style="background:none;border:none;color:white;cursor:pointer;font-size:20px;">×</button>
        </div>
        <div id="chat-widget-messages">
          <div class="chat-message bot">
            👋 Hello! How can I help you today?
          </div>
        </div>
        <div id="chat-widget-input">
          <div id="chat-widget-input-container">
            <input type="text" placeholder="Type your message...">
            <button onclick="ChatWidget.sendMessage()">Send</button>
          </div>
        </div>
      </div>
      <div id="chat-widget-button" onclick="ChatWidget.toggle()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      </div>
    `;
    document.body.appendChild(widget);

    // Initialize functionality
    const chatWindow = document.getElementById("chat-widget-window");
    const messageInput = chatWindow.querySelector("input");
    const messagesContainer = document.getElementById("chat-widget-messages");

    // Handle Enter key
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        ChatWidget.sendMessage();
      }
    });

    // Store config
    ChatWidget.config = config;
  }

  static toggle() {
    const chatWindow = document.getElementById("chat-widget-window");
    const isVisible = chatWindow.style.display === "block";
    chatWindow.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
      const input = chatWindow.querySelector("input");
      input.focus();
    }
  }

  static async sendMessage() {
    const chatWindow = document.getElementById("chat-widget-window");
    const messageInput = chatWindow.querySelector("input");
    const messagesContainer = document.getElementById("chat-widget-messages");
    const text = messageInput.value.trim();

    if (!text) return;

    // Add user message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "chat-message user";
    userMessageDiv.textContent = text;
    messagesContainer.appendChild(userMessageDiv);

    // Clear input
    messageInput.value = "";
    messageInput.disabled = true;

    // Add loading indicator
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "chat-loading";
    loadingDiv.innerHTML = "<div></div><div></div><div></div>";
    messagesContainer.appendChild(loadingDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      // Send message to API
      const response = await fetch(ChatWidget.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: ChatWidget.config.clientId,
          message: text,
        }),
      });

      const data = await response.json();

      // Remove loading indicator
      loadingDiv.remove();

      // Add bot response
      const botMessageDiv = document.createElement("div");
      botMessageDiv.className = "chat-message bot";
      botMessageDiv.textContent =
        data.response || "Sorry, I encountered an error. Please try again.";
      messagesContainer.appendChild(botMessageDiv);
    } catch (error) {
      // Remove loading indicator
      loadingDiv.remove();

      // Add error message
      const errorDiv = document.createElement("div");
      errorDiv.className = "chat-message bot";
      errorDiv.textContent = "Sorry, I encountered an error. Please try again.";
      messagesContainer.appendChild(errorDiv);
    }

    // Re-enable input
    messageInput.disabled = false;
    messageInput.focus();

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
