const GoogleAuth = window.Capacitor.Plugins.GoogleAuth;

// =========================
// CONFIGURACIÓN
// =========================
const API_URL = "https://space-duel-server-1.onrender.com";

// Inicializar Google Auth
try {
    GoogleAuth.initialize({
        clientId: '73289370828-9sq2pqa6vnk8ukki4bepa154hoke12eb.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
    });
} catch (e) {
    console.log("Google Auth ya inicializado o error:", e);
}

const nameInput = document.getElementById("name");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const nameError = document.getElementById("nameError");

// =========================
// MENSAJE DE ERROR
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

/* 
  SUSPICHOSO PAusADO: 
  Si quieres forzar que siempre muestre la pantalla de registro para probar el diseño, 
  comenta esta validación. 
*/
/*
if (localStorage.getItem("playerCreated") === "true") {
    location.href = "profile.html";
}
*/

// =========================
// LOGIN / REGISTRO CON GOOGLE (Y APODO PERSONALIZADO)
// =========================

if (googleLoginBtn) {
    googleLoginBtn.onclick = async () => {
        hideError();

        const customUsername = nameInput ? nameInput.value.trim() : "";

        // Validar que el usuario haya escrito un apodo
        if (customUsername.length < 3) {
            showError("El nombre de usuario debe tener al menos 3 caracteres.");
            if (nameInput) nameInput.focus();
            return;
        }

        googleLoginBtn.disabled = true; // Evitar doble clic

        try {
            const googleUser = await GoogleAuth.signIn();
            console.log("Usuario Google obtenido:", googleUser);

            // Enviamos el apodo personalizado + los datos de Google
            const response = await fetch(`${API_URL}/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: googleUser.email,
                    username: customUsername,
                    idToken: googleUser.authentication?.idToken
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("player", JSON.stringify(data.player));
                localStorage.setItem("playerCreated", "true");
                location.href = "profile.html";
            } else {
                showError(data.error || "No se pudo iniciar sesión con Google.");
            }

        } catch (error) {
            console.error("Error en Google Sign-In:", error);
            showError("Error al conectar con Google.");
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