// ========================================
// LAUGH BATTLES
// CHAT
// ========================================

const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
const form = document.getElementById("chatForm");


// ========================================
// ENVIAR MENSAJE
// ========================================

function sendMessage() {

    const text = input.value.trim();

    // No enviar mensajes vacíos
    if (text === "") {
        return;
    }

    // Crear mensaje
    const div = document.createElement("div");

    div.className = "message me";

    // Mostrar texto sin interpretar HTML
    div.textContent = text;

    // Agregar a la conversación
    messages.appendChild(div);

    // Limpiar campo
    input.value = "";

    // Bajar automáticamente al último mensaje
    messages.scrollTop = messages.scrollHeight;

    // Mantener el campo listo para escribir
    input.focus();
}


// ========================================
// BOTÓN ENVIAR
// ========================================

button.addEventListener("click", (event) => {

    event.preventDefault();

    sendMessage();

});


// ========================================
// ENTER PARA ENVIAR
// ========================================

input.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});


// ========================================
// EVITAR RECARGAR LA PÁGINA
// ========================================

if (form) {

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        sendMessage();

    });

}