(function() {
    // Crear el HTML del widget
    var widgetHTML = `
      <style>
        #chat-widget {
          display: none;
          position: fixed;
          bottom: 0;
          right: 0;
          width: 300px;
          background: #fff;
          border: 1px solid #ddd;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        #chat-header {
          background: #007bff;
          color: #fff;
          padding: 10px;
          font-size: 16px;
          font-weight: bold;
        }
        #chat-controls {
          float: right;
        }
        #chat-controls button {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
        }
        #chat-body {
          padding: 10px;
          max-height: 200px;
          overflow-y: auto;
        }
        #chat-input {
          width: calc(100% - 80px);
          padding: 10px;
          border: 1px solid #ddd;
          border-top: none;
          box-sizing: border-box;
        }
        #send-button {
          width: 80px;
          padding: 10px;
          border: 1px solid #ddd;
          border-top: none;
          background: #007bff;
          color: #fff;
          cursor: pointer;
          box-sizing: border-box;
        }
        #chat-button {
          position: fixed;
          bottom: 10px;
          right: 10px;
          background: #007bff;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 1000;
        }
      </style>
      <button id="chat-button">
        <img src="https://example.com/path/to/your/icon.png" alt="Chat Icon">
      </button>
      <div id="chat-widget">
        <div id="chat-header">
          <span>OLAF</span>
          <div id="chat-controls">
            <button id="close-button">x</button>
          </div>
        </div>
        <div id="chat-body">
          <!-- Mensajes del chat se mostrarán aquí -->
        </div>
        <input type="text" id="chat-input" placeholder="Escribe un mensaje...">
        <button id="send-button">Enviar</button>
      </div>
    `;
  
    // Insertar el HTML en el body del documento
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
    // Controla la visibilidad del widget de chat y el botón
    document.getElementById('chat-button').addEventListener('click', function() {
      var widget = document.getElementById('chat-widget');
      widget.style.display = 'block';
      document.getElementById('chat-button').style.display = 'none';
    });
  
    // Controla el botón de cerrar el chat
    document.getElementById('close-button').addEventListener('click', function() {
      var widget = document.getElementById('chat-widget');
      widget.style.display = 'none';
      document.getElementById('chat-button').style.display = 'block';
    });
  
    // Envía un mensaje al servidor (simulación)
    document.getElementById('send-button').addEventListener('click', function() {
      var message = document.getElementById('chat-input').value;
      if (message.trim() !== '') {
        // Muestra el mensaje en el chat
        var chatBody = document.getElementById('chat-body');
        chatBody.innerHTML += `<div>${message}</div>`;
        document.getElementById('chat-input').value = '';
  
        // Aquí podrías enviar el mensaje al servidor si fuera necesario
        // Por ejemplo, usando fetch() para una API de chat
      }
    });
  })();
  