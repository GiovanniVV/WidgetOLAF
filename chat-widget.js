(function () {
  // Crear el HTML del widget
  var widgetHTML = `
<style>
{% load static %}
/*Para modo claro*/
:root {
      --body-widget-bg: #e9e9e9;
      --chat-header-widget-bg: #191852;
      --chat-input-bg: #ddd;
      --bot-message-bg: #f1f1f1;
      --bot-message-color: #333;
      --color-input-pregunta: #333;
    }

    .dark-mode {
      --body-widget-bg: #333;
      --chat-header-widget-bg: #1c1c1c;
      --chat-input-bg: #1c1c1c;
      --bot-message-bg: #575757;
      --bot-message-color: white;
      --color-input-pregunta: white;
    }

    body{
      font-family: 'Poppins', sans-serif;
      background-color: #1c1c1c;
    }

    /* Estilo del botón del chat */
    #chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      border: none;
      border-radius: 50%;
      width: 75px;
      height: 75px;
      cursor: pointer;
      outline: none;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
    }

    #chat-button:focus,
    #chat-button:active {
      outline: none !important;
      /* Elimina cualquier contorno */
      box-shadow: none !important;
      /* Elimina sombras de enfoque */
    }

    #chat-button img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      pointer-events: none;
      /* Evita que la imagen reciba el enfoque */
    }

    #chat-button:focus-visible {
      outline: none !important;
      /* Forza la eliminación del contorno en navegadores que usan :focus-visible */
    }

    #chat-button::-moz-focus-inner {
      border: 0 !important;
      /* Elimina bordes internos específicos de Firefox */
    }

    #chat-button:focus:not(:focus-visible) {
      outline: none !important;
      /* Asegura que se elimine el borde en navegadores con focus no visible */
    }

    /* Estilo del widget de chat */
    #chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 340px;
      height: 460px;
      border: none;
      background-color: var(--body-widget-bg);
      border-radius: 8px;
      display: none;
      /* Inicialmente oculto */
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      transition: transform 0.3s ease, opacity 0.3s ease;
      /* Transiciones suaves */
    }

    #chat-widget.hidden {
      transform: translateY(100%);
      opacity: 0;
    }

    /* Estilo del encabezado del chat */
    #chat-header {
      background-color: var(--chat-header-widget-bg);
      color: white;
      padding: 10px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      /* Sombra sutil */
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
      line-height: 1.2;
    }

    .header-name {
      font-weight: bold;
      font-size: 18px;
      /* Tamaño de fuente más grande */
    }

    .header-status {
      font-size: 12px;
      color: #dcdcdc;
    }

    #chat-controls {
      flex: 1;
      display: flex;
      flex-direction: row;
      margin-left: 90px;
      height: 67%;
      /* Asegúrate de que el contenedor ocupa la altura total */
      gap: 0px;
    }

    #chat-controls button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      /* Tamaño de fuente más grande */
      cursor: pointer;
      margin: 0;
      /* Elimina el margen */
      padding: 0;
      /* Elimina el padding */
      outline: none;
      width: 40px;
      /* Ajusta el tamaño del botón si es necesario */
      height: 40px;
      /* Ajusta el tamaño del botón si es necesario */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #chat-controls button:focus,
    #chat-controls button:active {
      outline: none;
      box-shadow: none;
      /* Elimina sombras o bordes adicionales */
    }

    /* Estilo del cuerpo del chat */
    #chat-body {
      height: calc(100% - 112px);
      /* Ajusta la altura para que ocupe el espacio restante */
      overflow-y: auto;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
      /* Tamaño de letra ajustado */
      display: flex;
      flex-direction: column;
      gap: 10px;
      /* Espacio entre mensajes */
      overflow-y: scroll;
      /* Para asegurar el desplazamiento interno */
      scrollbar-width: none;
      /* Oculta scrollbar en Firefox */
      -ms-overflow-style: none;
      /* Oculta scrollbar en IE y Edge */
    }

    #chat-body::-webkit-scrollbar {
      display: none;
      /* Oculta scrollbar en Chrome, Safari y Opera */
    }

    /* Estilo de los mensajes del chat */
    .message {
      padding: 8px 10px;
      /* Ajusta el padding para que no quede demasiado espacio */
      border-radius: 8px;
      max-width: 80%;
      display: inline-block;
      word-wrap: break-word;
      /* Ajusta el texto largo en la línea */
      width: auto;
      /* Permite que el ancho se ajuste al contenido */
    }

    .user-message {
      background-color: var(--chat-header-widget-bg);
      color: white;
      text-align: right;
      align-self: flex-end;
      /* Alinea a la derecha */
      font-weight: normal;
      /* Asegura que el texto no esté en negrita */
    }

    .bot-message {
      background-color: var(--bot-message-bg);
      color: var(--bot-message-color);
      text-align: left;
      align-self: flex-start;
      /* Alinea a la izquierda */
      font-weight: normal;
      /* Asegura que el texto no esté en negrita */
    }

    #chat-input {
      width: calc(100% - 20px);
      padding: 10px;
      border: none;
      border-radius: 8px;
      outline: none;
      box-sizing: border-box;
      font-size: 14px;
      /* Tamaño de letra ajustado */
      position: absolute;
      bottom: 5px;
      background-color: var(--chat-input-bg);
      left: 50%;
      transform: translateX(-50%);
      /* Centra el campo de entrada horizontalmente */
      color: var(--color-input-pregunta);
    }

    #chat-button:focus,
    #close-button:focus {
      outline: 2px solid #007bff;
    }
</style>
<!-- Botón para abrir el chat con ícono -->
<button id="chat-button" aria-label="Abrir chat">
  <img id="chat-avatar-ini" src="">
</button>

<!-- Contenedor del widget de chat -->
<div id="chat-widget" aria-live="polite">
  <div id="chat-header">
      <div id="header-content">
        <img id="chat-avatar" src="" class="avatar" alt="Avatar de chat">
          <div class="header-text">
              <div class="header-name" id="header-name">Sofdino</div>
              <div class="header-status">En línea</div>
          </div>
          <div id="chat-controls">
            <button id="toggle-theme" class="theme-toggle-btn-widget">
                🌙
              </button>
              <button id="close-button" aria-label="Cerrar chat">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="25px" height="25px">
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
      }, 300);
      document.getElementById("chat-button").style.display = "block";
    });

  document
    .getElementById("chat-input")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        var input = document.getElementById("chat-input").value;
        if (input.trim() !== "") {
          sendMessage(input);
        }
      }
    });

  
  async function obtenerToken() {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/token/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  username: "edmartinez",
                  password: "admin"
              })
          });
  
          if (!response.ok) {
              throw new Error("Error al obtener el token");
          }else{
            //console.log("Se logeo correctamente");
          }
  
          const data = await response.json();
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
      } catch (error) {
          console.error("Error de autenticación:", error);
      }
  }
  
  async function refreshToken() {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;
  
      try {
          const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ refresh: refreshToken })
          });
  
          if (!response.ok) {
              throw new Error("Error al refrescar el token");
          }
  
          const data = await response.json();
          localStorage.setItem('accessToken', data.access);
      } catch (error) {
          console.error("Error al actualizar el token:", error);
      }
    }

    async function obtenerUsuarioAutenticado() {
      const token = localStorage.getItem('accessToken'); // Obtiene el token almacenado
  
      if (!token) {
          //console.log("No hay usuario autenticado.");
          return;
      }
  
      try {
          const response = await fetch('http://127.0.0.1:8000/api/user/', { // Ajusta la URL al endpoint de usuario
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` // Enviar el token en la cabecera
              }
          });
  
          if (!response.ok) {
              throw new Error("Error al obtener el usuario");
          }
  
          const data = await response.json();
          //console.log("Usuario autenticado:", data); // Imprime la información del usuario
          obtenerDetallesWidget(); // ========================================================================================================REVISAR A ELIMINAR==============================================================================
      } catch (error) {
          console.error("Error al obtener el usuario:", error);
      }
  }
  
  // Llamar la función después de autenticarse
  obtenerUsuarioAutenticado();
  
  async function obtenerDetallesWidget() {
    const token = localStorage.getItem('accessToken');
    try{
      const response = await fetch('http://127.0.0.1:8000/obtener_detalles_widget/', { // Ajusta la URL al endpoint de usuario
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviar el token en la cabecera
        }
      });

      if (!response.ok) {
        throw new Error("Error en la función de obtener los datos del widget");
      }

      const data = await response.json();
      console.log("Detalles del widget:", data); // Imprime la información del usuario

      // 1. Cambiar la variable CSS
      document.documentElement.style.setProperty('--chat-header-widget-bg', data.color);
      //document.documentElement.style.setProperty('--bot-message-bg', data.color); 

      // 2. Establecer la imagen en el <img>
      const avatarImg = document.getElementById('chat-avatar');
      if (avatarImg && data.imagen) {
        avatarImg.src = data.imagen;
      }
      const avatarImg2 = document.getElementById('chat-avatar-ini');
      if (avatarImg2 && data.imagen) {
        avatarImg2.src = data.imagen;
      }

      // 3. Establecer el nombre dentro del <div class="header-name">
      const nameDiv = document.getElementById('header-name');
      if (nameDiv && data.nombre) {
        nameDiv.textContent = data.nombre;
      }

    }catch(error){
      console.error("Error al obtener los detalles del widget",error);
    }
  }
  
  obtenerToken();
  setInterval(refreshToken, 240000);// Refresca el token cada 4 minutos (antes de que expire)
  // Llamar la función después de autenticarse
  

  async function sendMessage(message) {
    //console.log("Llego a lla funcion de sendMesaage");
    appendMessage(message, "user");

    obtenerUsuarioAutenticado();

    const token = localStorage.getItem('accessToken');
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    //console.log("EL valor del token es");
    //console.log(token);

    try {
        const response = await fetch(`http://127.0.0.1:8000/generar_respuesta/${encodeURIComponent(message)}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verifica el código de respuesta
        //console.log("Código de respuesta:", response.status);

        // Obtén la respuesta en texto en lugar de JSON para ver su contenido
        const text = await response.text();
        //console.log("Respuesta del servidor:", text);

        // Intenta convertirlo en JSON solo si la respuesta es válida
        try {
            const data = JSON.parse(text);
            appendMessage(data.mensaje, "bot");
        } catch (jsonError) {
            console.error("Error al convertir la respuesta en JSON:", jsonError);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }

    document.getElementById("chat-input").value = "";
  }

  //Funciones para cambio de tema en widget
  //Verifica la ultima preferencia guardada por el usuario
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      document.getElementById('toggle-theme').textContent = '☀️';
    }
  });

  //Función para cambiar entre modo claro y oscuro
  const toggleButton = document.getElementById('toggle-theme');
  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      toggleButton.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      toggleButton.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });

  function appendMessage(message, sender) {

    if (!message) {
      console.error("El mensaje es undefined o vacío:", message);
      return;  // Evita que el código siga ejecutándose con un valor inválido
    }

    //console.log("Mensaje recibido:", message);
    //console.log("Remitente:", sender);

    var chatBody = document.getElementById("chat-body");
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(sender + "-message");

    if (sender === "bot") {
      let index = 0;
      let typingInterval = setInterval(() => {
        if (index < message.length) {
          messageElement.textContent += message.charAt(index);
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // Velocidad de escritura (en milisegundos por carácter)
    } else {

      messageElement.textContent = message;
    }

    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
})();