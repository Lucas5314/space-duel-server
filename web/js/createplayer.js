
import { SocialLogin } from '@capgo/capacitor-social-login';
// Despertar el servidor de Render al cargar la vista de login
window.addEventListener("DOMContentLoaded", () => {
    fetch(`${API_URL}/`)
        .then(() => console.log("Servidor despertado con éxito."))
        .catch(() => console.log("Despertando backend..."));
});

// =========================
// CONFIGURACIÓN
// =========================

const API_URL = "https://space-duel-server-1.onrender.com";

const WEB_CLIENT_ID =
    "73289370828-9sq2pqa6vnk8ukki4bepa154hoke12eb.apps.googleusercontent.com";

const nameInput = document.getElementById("name");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const nameError = document.getElementById("nameError");

// =========================
// INICIALIZAR GOOGLE LOGIN
// =========================

let googleInitialization = null;

function initializeGoogle() {

    if (!googleInitialization) {

        googleInitialization = SocialLogin.initialize({
            google: {
                webClientId: WEB_CLIENT_ID,
                mode: 'online'
            }
        }).catch(error => {

            googleInitialization = null;

            console.error("Error inicializando Google:", error);

            throw error;
        });
    }

    return googleInitialization;
}

// =========================
// MENSAJES DE ERROR
// =========================

function showError(message) {

    if (nameError) {
        nameError.textContent = message;
        nameError.classList.add("show");
    }
}

function hideError() {

    if (nameError) {
        nameError.textContent = "";
        nameError.classList.remove("show");
    }
}

// Quitar error al escribir

if (nameInput) {

    nameInput.addEventListener("input", () => {
        hideError();
    });
}

// =========================
// LOGIN / REGISTRO CON GOOGLE
// =========================

if (googleLoginBtn) {

    googleLoginBtn.onclick = async () => {

        hideError();

        const customUsername = nameInput
            ? nameInput.value.trim()
            : "";

        // Validar apodo

        if (customUsername.length < 3) {

            showError(
                "El nombre de usuario debe tener al menos 3 caracteres."
            );

            if (nameInput) nameInput.focus();

            return;
        }

        googleLoginBtn.disabled = true;

        try {

            // Inicializar plugin

            await initializeGoogle();

            // Iniciar sesión con Google

            const login = await SocialLogin.login({
                provider: 'google',
                options: {
                    scopes: ['email', 'profile']
                }
            });

            console.log("Respuesta de Google:", login);

            // Obtener información

            const googleUser = login.result;

            if (!googleUser || googleUser.responseType !== 'online') {
                throw new Error("Respuesta de Google no válida.");
            }

            const email = googleUser.profile?.email;
            const idToken = googleUser.idToken;

            if (!email || !idToken) {
                throw new Error(
                    "Google no devolvió el correo o el token de identificación."
                );
            }

            // =========================
            // ENVIAR DATOS A RENDER
            // =========================

            const response = await fetch(
                `${API_URL}/api/auth/google`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: email,

                        username: customUsername,

                        idToken: idToken

                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.error || "No se pudo registrar el jugador."
                );
            }

            // =========================
            // GUARDAR JUGADOR
            // =========================

            localStorage.setItem(
                "player",
                JSON.stringify(data.player)
            );

            localStorage.setItem(
                "playerCreated",
                "true"
            );

            // Ir al perfil

            location.href = "profile.html";

        } catch (error) {

            console.error("Error en Google Login:", error);

            showError(
                error.message || "Error al conectar con Google."
            );

        } finally {

            googleLoginBtn.disabled = false;

        }
    };
}

// =========================
// ENTER EN EL TECLADO
// =========================

if (nameInput) {

    nameInput.addEventListener("keydown", e => {

        if (e.key === "Enter" && googleLoginBtn) {
            googleLoginBtn.click();
        }

    });

}

// =========================
// INICIALIZACIÓN TEMPRANA
// =========================

initializeGoogle().catch(error => {
    console.error("No se pudo preparar Google Login:", error);
});
