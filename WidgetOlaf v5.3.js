(function () {
  var firstMessageSent = false;
  
  var widgetHTML = `
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  :root {
    --chat-primary: #D76D38;
    --chat-secondary: #D74F30;
    --chat-blue: #80B1D5;
    --chat-blue-dark: #3078B8;
    --chat-bg: #F2F2F2;
    --chat-white: #FFFFFF;
    --chat-text: #1A1A1A;
    --chat-text-light: #666666;
    --chat-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
    --chat-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
    --chat-shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.15);
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(255, 255, 255, 0.3);
    --bot-bubble-bg: rgba(220, 220, 220, 0.95);
    --user-bubble-bg: #D76D38;
  }

  .dark-mode-chat {
    --chat-bg: #1A1A1A;
    --chat-white: #1A1A1A;
    --chat-text: #FFFFFF;
    --chat-text-light: #B0B0B0;
    --glass-bg: rgba(26, 26, 26, 0.85);
    --glass-border: rgba(255, 255, 255, 0.1);
    --bot-bubble-bg: rgba(60, 60, 60, 0.95);
  }

  /* Botón Flotante - Solo imagen sin fondo */
  #chat-button-modern {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: visible;
    padding: 0;
  }

  #chat-button-modern:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  #chat-button-modern img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  #chat-button-modern.hidden {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.5);
  }

  /* Badge de notificación */
  .chat-badge-notification {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 18px;
    height: 18px;
    background: #ff4444;
    border-radius: 50%;
    border: 2px solid var(--chat-white);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  /* Widget Principal */
  #chat-widget-modern {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 380px;
    height: 550px;
    background: var(--glass-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-radius: 20px;
    border: 1px solid var(--glass-border);
    box-shadow: var(--chat-shadow-lg);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 99999;
    font-family: 'Inter', sans-serif;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  #chat-widget-modern.visible {
    display: flex;
    animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Header Moderno */
  #chat-header-modern {
    background: linear-gradient(135deg, var(--chat-primary), var(--chat-secondary));
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  #chat-header-modern::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .chat-avatar-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .chat-avatar-modern {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .status-indicator {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 11px;
    height: 11px;
    background: #4ade80;
    border-radius: 50%;
    border: 2px solid var(--chat-primary);
    animation: pulse-status 2s infinite;
  }

  @keyframes pulse-status {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
    50% { box-shadow: 0 0 0 4px rgba(74, 222, 128, 0); }
  }

  .chat-header-info {
    flex: 1;
    color: white;
  }

  .chat-header-name {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 2px;
    letter-spacing: -0.3px;
  }

  .chat-header-status {
    font-size: 12px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .typing-indicator-header {
    display: none;
    align-items: center;
    gap: 2px;
  }

  .typing-indicator-header.active {
    display: flex;
  }

  .typing-dot {
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  .chat-header-actions {
    display: flex;
    gap: 6px;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .chat-header-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
  }

  .chat-header-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .chat-header-btn svg {
    width: 18px;
    height: 18px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }

  /* Body del Chat */
  #chat-body-modern {
    flex: 1;
    overflow-y: auto;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(215, 109, 56, 0.3) transparent;
  }

  #chat-body-modern::-webkit-scrollbar {
    width: 6px;
  }

  #chat-body-modern::-webkit-scrollbar-track {
    background: transparent;
  }

  #chat-body-modern::-webkit-scrollbar-thumb {
    background: rgba(215, 109, 56, 0.3);
    border-radius: 10px;
  }

  #chat-body-modern::-webkit-scrollbar-thumb:hover {
    background: rgba(215, 109, 56, 0.5);
  }

  /* Mensaje de Bienvenida */
  .welcome-message-modern {
    text-align: center;
    padding: 30px 20px;
    animation: fadeIn 0.6s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .welcome-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 14px;
    background: linear-gradient(135deg, var(--chat-primary), var(--chat-secondary));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    box-shadow: 0 8px 24px rgba(215, 109, 56, 0.3);
  }

  .welcome-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--chat-text);
    margin-bottom: 8px;
  }

  .welcome-subtitle {
    font-size: 14px;
    color: var(--chat-text-light);
    line-height: 1.5;
  }

  /* Burbujas de Mensaje */
  .message-bubble {
    max-width: 75%;
    padding: 12px 14px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    animation: messageSlide 0.3s ease;
    position: relative;
  }

  @keyframes messageSlide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .user-message-bubble {
    align-self: flex-end;
    background: var(--user-bubble-bg);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(215, 109, 56, 0.3);
  }

  .bot-message-bubble {
    align-self: flex-start;
    background: var(--bot-bubble-bg);
    backdrop-filter: blur(10px);
    color: var(--chat-text);
    border-bottom-left-radius: 4px;
    border: 1px solid var(--glass-border);
  }

  /* Estilos para markdown */
  .bot-message-bubble strong {
    font-weight: 700;
    color: var(--chat-primary);
  }

  .bot-message-bubble ul,
  .bot-message-bubble ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  .bot-message-bubble li {
    margin: 4px 0;
  }

  .bot-message-bubble p {
    margin: 8px 0;
  }

  .bot-message-bubble p:first-child {
    margin-top: 0;
  }

  .bot-message-bubble p:last-child {
    margin-bottom: 0;
  }

  .message-time {
    font-size: 10px;
    opacity: 0.6;
    margin-top: 4px;
    display: block;
  }

  /* Indicador de escritura */
  .typing-indicator-bubble {
    align-self: flex-start;
    background: var(--bot-bubble-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    padding: 14px 18px;
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .typing-indicator-bubble .typing-dot {
    width: 8px;
    height: 8px;
    background: var(--chat-primary);
  }

  /* Input Moderno */
  .chat-input-container {
    padding: 12px 16px;
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--glass-border);
  }

  .chat-input-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 4px 4px 4px 14px;
    transition: all 0.3s;
  }

  .dark-mode-chat .chat-input-wrapper {
    background: rgba(60, 60, 60, 0.6);
  }

  .chat-input-wrapper:focus-within {
    border-color: var(--chat-primary);
    box-shadow: 0 0 0 3px rgba(215, 109, 56, 0.1);
  }

  #chat-input-modern {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: var(--chat-text);
    font-family: 'Inter', sans-serif;
    padding: 6px 0;
  }

  #chat-input-modern::placeholder {
    color: var(--chat-text-light);
  }

  .chat-send-btn {
    min-width: 36px;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--chat-primary), var(--chat-secondary));
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
  }

  .chat-send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(215, 109, 56, 0.4);
  }

  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chat-send-btn svg {
    width: 18px;
    height: 18px;
    stroke: white;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* Responsive */
  @media (max-width: 480px) {
    #chat-widget-modern {
      width: calc(100vw - 32px);
      height: calc(100vh - 100px);
      bottom: 16px;
      right: 16px;
    }

    #chat-button-modern {
      bottom: 16px;
      right: 16px;
      width: 60px;
      height: 60px;
    }
  }
  </style>

  <!-- Botón Flotante -->
  <button id="chat-button-modern" aria-label="Abrir chat">
    <img src="https://storage.googleapis.com/sofmu-olaf/olaf-icons/SofChat.png" alt="Chat avatar">
    <span class="chat-badge-notification"></span>
  </button>

  <!-- Widget de Chat -->
  <div id="chat-widget-modern">
    <!-- Header -->
    <div id="chat-header-modern">
      <div class="chat-avatar-wrapper">
        <img src="https://storage.googleapis.com/sofmu-olaf/olaf-icons/SofChat.png" alt="Sofdino Avatar" class="chat-avatar-modern">
        <span class="status-indicator"></span>
      </div>
      <div class="chat-header-info">
        <div class="chat-header-name">Sofdino</div>
        <div class="chat-header-status">
          <span class="status-text">En línea</span>
          <div class="typing-indicator-header">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="chat-header-btn" id="toggle-theme-modern" title="Cambiar tema">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        <button class="chat-header-btn" id="close-button-modern" title="Cerrar chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Body -->
    <div id="chat-body-modern">
      <div class="welcome-message-modern" id="welcome-message-modern">
        <div class="welcome-icon">👋</div>
        <div class="welcome-title">¡Hola! Soy Sofdino</div>
        <div class="welcome-subtitle">Tu asistente inteligente 24/7. ¿En qué puedo ayudarte hoy?</div>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input-container">
      <div class="chat-input-wrapper">
        <input 
          type="text" 
          id="chat-input-modern" 
          placeholder="Escribe tu mensaje..."
          aria-label="Campo de entrada del chat"
        >
        <button class="chat-send-btn" id="send-button-modern" disabled>
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", widgetHTML);

  // Referencias
  const chatButton = document.getElementById("chat-button-modern");
  const chatWidget = document.getElementById("chat-widget-modern");
  const closeButton = document.getElementById("close-button-modern");
  const chatInput = document.getElementById("chat-input-modern");
  const sendButton = document.getElementById("send-button-modern");
  const chatBody = document.getElementById("chat-body-modern");
  const welcomeMessage = document.getElementById("welcome-message-modern");
  const toggleTheme = document.getElementById("toggle-theme-modern");
  const typingIndicatorHeader = document.querySelector(".typing-indicator-header");

  // Abrir chat
  chatButton.addEventListener("click", function () {
    chatWidget.classList.add("visible");
    chatButton.classList.add("hidden");
    chatInput.focus();
  });

  // Cerrar chat
  closeButton.addEventListener("click", function () {
    chatWidget.classList.remove("visible");
    setTimeout(() => {
      chatButton.classList.remove("hidden");
    }, 300);
  });

  // Habilitar botón de envío cuando hay texto
  chatInput.addEventListener("input", function () {
    sendButton.disabled = !chatInput.value.trim();
  });

  // Enviar mensaje con Enter
  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && chatInput.value.trim()) {
      sendMessage(chatInput.value.trim());
    }
  });

  // Enviar mensaje con botón
  sendButton.addEventListener("click", function () {
    if (chatInput.value.trim()) {
      sendMessage(chatInput.value.trim());
    }
  });

  // Toggle tema
  toggleTheme.addEventListener("click", function () {
    chatWidget.classList.toggle("dark-mode-chat");
    const isDark = chatWidget.classList.contains("dark-mode-chat");
    
    this.innerHTML = isDark 
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    
    localStorage.setItem('chatTheme', isDark ? 'dark' : 'light');
  });

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('chatTheme');
  if (savedTheme === 'dark') {
    chatWidget.classList.add('dark-mode-chat');
    toggleTheme.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  }

  // Funciones de autenticación
  async function obtenerToken() {
    try {
      const response = await fetch('https://olaf-613468186347.us-central1.run.app/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: "sofdino", password: "admin" })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
    }
  }

  async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    try {
      const response = await fetch('https://olaf-613468186347.us-central1.run.app/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
      }
    } catch (error) {
      console.error("Error al actualizar el token:", error);
    }
  }

  obtenerToken();
  setInterval(refreshToken, 240000);

  // Función para parsear markdown simple
  function parseMarkdown(text) {
    // Negritas
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Listas numeradas
    const lines = text.split('\n');
    let inList = false;
    let html = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detectar lista numerada
      if (/^\d+\.\s/.test(line)) {
        if (!inList) {
          html += '<ol>';
          inList = true;
        }
        html += '<li>' + line.replace(/^\d+\.\s/, '') + '</li>';
      } else {
        if (inList) {
          html += '</ol>';
          inList = false;
        }
        if (line.trim()) {
          html += '<p>' + line + '</p>';
        }
      }
    }
    
    if (inList) {
      html += '</ol>';
    }
    
    return html;
  }

  // Función para enviar mensaje
  async function sendMessage(message) {
    if (!firstMessageSent) {
      welcomeMessage.style.display = "none";
      firstMessageSent = true;
    }

    appendMessage(message, "user");
    chatInput.value = "";
    sendButton.disabled = true;

    // Mostrar indicador de escritura
    showTypingIndicator();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      hideTypingIndicator();
      appendMessage("Error: No hay sesión activa. Intenta de nuevo.", "bot");
      return;
    }

    try {
      const response = await fetch(`https://olaf-613468186347.us-central1.run.app/generar_respuesta/${encodeURIComponent(message)}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const text = await response.text();
      const data = JSON.parse(text);
      
      hideTypingIndicator();
      appendMessage(data.mensaje, "bot");
    } catch (error) {
      hideTypingIndicator();
      appendMessage("Lo siento, hubo un error. Por favor intenta de nuevo.", "bot");
      console.error("Error en la solicitud:", error);
    }
  }

  function appendMessage(message, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message-bubble ${sender}-message-bubble`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    if (sender === "bot") {
      // Parsear markdown para el bot
      const parsedMessage = parseMarkdown(message);
      messageDiv.innerHTML = `${parsedMessage}<span class="message-time">${time}</span>`;
    } else {
      messageDiv.innerHTML = `${message}<span class="message-time">${time}</span>`;
    }
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    typingIndicatorHeader.classList.add("active");
    
    const typingBubble = document.createElement("div");
    typingBubble.className = "typing-indicator-bubble";
    typingBubble.id = "typing-bubble";
    typingBubble.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatBody.appendChild(typingBubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function hideTypingIndicator() {
    typingIndicatorHeader.classList.remove("active");
    const typingBubble = document.getElementById("typing-bubble");
    if (typingBubble) {
      typingBubble.remove();
    }
  }
})();