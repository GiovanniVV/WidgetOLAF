(function () {
  console.log("Script cargado correctamente");
  // Crear el HTML del widget
  var widgetHTML = `
<style>
/* Estilo del botón del chat */
#chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff; /* Azul más moderno */
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  outline: none;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

#chat-button img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Estilo del widget de chat */
#chat-widget {
  position: fixed;
  bottom: 40px;
  right: 20px;
  width: 300px;
  height: 400px;
  background-color: rgb(255, 255, 255);
  border: 1px solid #76BC21;
  border-radius: 8px;
  display: none; /* Inicialmente oculto */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease, opacity 0.3s ease; /* Transiciones suaves */
}

#chat-widget.hidden {
  transform: translateY(100%);
  opacity: 0;
}

/* Estilo del encabezado del chat */
#chat-header {
  background-color: #76BC21;
  color: white;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra sutil */
}

#header-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-name {
  font-weight: bold;
  font-size: 18px; /* Tamaño de fuente más grande */
}

.header-status {
  font-size: 12px;
  color: #dcdcdc;
}

#chat-controls {
  display: flex;
  align-items: center;
}

#chat-controls button {
  background: none;
  border: none;
  color: white;
  font-size: 20px; /* Tamaño de fuente más grande */
  cursor: pointer;
  margin-left: 10px;
  outline: none;
}

/* Estilo del cuerpo del chat */
#chat-body {
  height: calc(100% - 112px); /* Ajusta la altura para que ocupe el espacio restante */
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  font-size: 14px; /* Tamaño de letra ajustado */
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espacio entre mensajes */
}

/* Estilo de los mensajes del chat */
.message {
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
  display: inline-block;
  word-wrap: break-word; /* Ajusta el texto largo en la línea */
}

.user-message {
  background-color: #76BC21;
  color: white;
  text-align: right;
  align-self: flex-end; /* Alinea a la derecha */
}

.bot-message {
  background-color: #f1f1f1;
  color: #333;
  text-align: left;
  align-self: flex-start; /* Alinea a la izquierda */
}

#chat-input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #76BC21;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  font-size: 14px; /* Tamaño de letra ajustado */
  position: absolute;
  bottom: 5px;
  background-color: #fff;
  left: 50%;
  transform: translateX(-50%); /* Centra el campo de entrada horizontalmente */
}

#chat-button:focus, #close-button:focus {
  outline: 2px solid #007bff;
}
</style>
<!-- Botón para abrir el chat con ícono -->
<button id="chat-button" aria-label="Abrir chat">
  <img src="http://127.0.0.1:8000/static/Fred262.png" alt="Icono de chat">
</button>

<!-- Contenedor del widget de chat -->
<div id="chat-widget" aria-live="polite">
  <div id="chat-header">
      <div id="header-content">
          <img src="http://127.0.0.1:8000/static/Fred262.png" class="avatar" alt="Avatar de chat">
          <div class="header-text">
              <div class="header-name">Olaf</div>
              <div class="header-status">En línea</div>
          </div>
          <div id="chat-controls">
              <button id="close-button" aria-label="Cerrar chat">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="20px" height="20px">
                      <path fill="#ffffff" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
                  </svg>
              </button>
          </div>
      </div>
  </div>
  <div id="chat-body" aria-live="polite">
      <input type="text" id="chat-input" placeholder="Escribe tu consulta..." aria-label="Campo de entrada del chat">
  </div>
</div>
`;

  // Insertar el HTML en el body del documento
  document.body.insertAdjacentHTML("beforeend", widgetHTML);

  // Controla la visibilidad del widget de chat y el botón
  document.getElementById("chat-button").addEventListener("click", function () {
      var widget = document.getElementById("chat-widget");
      widget.style.display = "block";
      widget.classList.remove('hidden');
      document.getElementById("chat-button").style.display = "none";
      document.getElementById("chat-input").focus(); // Foco en el campo de entrada
  });

  document
      .getElementById("close-button")
      .addEventListener("click", function () {
          var widget = document.getElementById("chat-widget");
          widget.classList.add('hidden');
          setTimeout(() => {
              widget.style.display = "none";
          }, 300); // Sincronizar con la duración de la transición
          document.getElementById("chat-button").style.display = "block";
      });

  document
      .getElementById("chat-input")
      .addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
              event.preventDefault(); // Prevenir el comportamiento por defecto del Enter (salto de línea)
              var input = document.getElementById("chat-input").value;
              if (input.trim() !== "") {
                  sendMessage(input);
              }
          }
      });

  function sendMessage(message) {
      // Mostrar mensaje del usuario en el chat
      appendMessage(message, "user");

      // Enviar mensaje al servidor
      fetch(`http://127.0.0.1:8000/generar_respuesta/${encodeURIComponent(message)}/`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Error en la respuesta del servidor');
              }
              return response.json();
          })
          .then(data => {
              if (data.mensaje) {
                  appendMessage(data.mensaje, "bot");
              } else {
                  console.error('Respuesta inválida:', data);
              }
          })
          .catch(error => console.error('Error:', error));

      // Limpiar el campo de entrada
      document.getElementById("chat-input").value = "";
  }

  function appendMessage(message, sender) {
      var chatBody = document.getElementById("chat-body");
      var messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.classList.add(sender + "-message");
      messageElement.textContent = message;
      chatBody.appendChild(messageElement);
      chatBody.scrollTop = chatBody.scrollHeight; // Desplazar hacia abajo para mostrar el nuevo mensaje
  }
})();
