import { ScreenOrientation } from '@capacitor/screen-orientation';

// ===========================
// CONFIGURACIÓN Y SESIÓN
// ===========================
const API_URL = "https://space-duel-server-1.onrender.com";

const savedPlayer = JSON.parse(localStorage.getItem("player")) || {};
const playerId = Number(savedPlayer.id) || Number(localStorage.getItem("playerId")) || 0;

if (!playerId) {
    console.warn("⚠️ No hay sesión activa, redirigiendo a createplayer...");
    location.href = "createplayer.html";
}

// ===========================
// BLOQUEO DE ORIENTACIÓN (CAPACITOR)
// ===========================
async function lockLandscape() {
    try {
        await ScreenOrientation.lock({ orientation: 'landscape' });
        console.log("Hangar bloqueado en horizontal");
    } catch (error) {
        console.log("Modo navegador web (sin Capacitor nativo)");
    }
}
lockLandscape();

// ===========================
// CATÁLOGO OFICIAL DE NAVES (Sincronizado con skins.js)
// ===========================
const navesDisponibles = [
    { id: "nave1", name: "Nave Azul", image: "assets/ships/naveee1.png" },
    { id: "nave2", name: "Nave Roja", image: "assets/ships/nave2.png" },
    { id: "nave3", name: "Nave Dorada", image: "assets/ships/naveee1.png" },
    { id: "nave4", name: "Nave Galaxia", image: "assets/ships/naveee1.png" },
    { id: "nave5", name: "Nave Eclipse", image: "assets/ships/naveee1.png" },
    { id: "nave6", name: "Nave Fénix", image: "assets/ships/naveee1.png" },
    { id: "nave7", name: "Nave Plasma", image: "assets/ships/naveee1.png" },
    { id: "nave8", name: "Nave Nebulosa", image: "assets/ships/naveee1.png" },
    { id: "nave9", name: "Nave Cometa", image: "assets/ships/naveee1.png" },
    { id: "nave10", name: "Nave Aurora", image: "assets/ships/naveee1.png" }
];

let skinsPoseidas = ["nave1"]; // La nave base siempre la tiene
let skinEquipada = savedPlayer.currentSkin || "nave1";

const categories = document.querySelector("#categories");
const items = document.querySelector("#items");
const avatarSprite = document.querySelector("#avatarSprite");
const toast = document.querySelector("#toast");

function render() {
    if (!items) return;

    // Filtrar únicamente las naves que el jugador posee en su inventario
    const navesFiltradas = navesDisponibles.filter(nave => 
        nave.id === "nave1" || skinsPoseidas.includes(nave.id)
    );

    // Renderizar la cuadrícula con las naves compradas/poseídas
    items.innerHTML = navesFiltradas.map((nave) => {
        const estaEquipada = nave.id === skinEquipada;
        return `
            <button class="item ${estaEquipada ? "selected" : ""}" data-skinid="${nave.id}">
                <span class="check">${estaEquipada ? "✓" : ""}</span>
                <span class="thumb">
                    <img src="${nave.image}" alt="${nave.name}">
                </span>
                <span class="item-name">${nave.name}</span>
            </button>`;
    }).join("");

    // Actualizar la vista previa de la nave en pantalla
    const activeShip = navesDisponibles.find(n => n.id === skinEquipada);
    if (activeShip && avatarSprite) {
        avatarSprite.src = activeShip.image;
    }
}

// ===========================
// CARGAR INVENTARIO DESDE RENDER
// ===========================
async function cargarInventario() {
    try {
        const response = await fetch(`${API_URL}/api/player/${playerId}/skins`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                skinsPoseidas = Array.isArray(data.skins) ? data.skins : ["nave1"];
                if (data.equipada) {
                    skinEquipada = data.equipada;
                    savedPlayer.currentSkin = skinEquipada;
                    localStorage.setItem("player", JSON.stringify(savedPlayer));
                }
            }
        }
        render();
    } catch (error) {
        console.error("Error cargando inventario en guardar/vestuario:", error);
        render();
    }
}

// ===========================
// SELECCIONAR / EQUIPAR NAVE
// ===========================
items.addEventListener("click", async event => {
    const button = event.target.closest("[data-skinid]");
    if (!button) return;

    const selectedSkinId = button.dataset.skinid;
    if (selectedSkinId === skinEquipada) return;

    try {
        // Enviar la petición de equipar al servidor en Render
        const response = await fetch(`${API_URL}/api/player/${playerId}/skins/equip`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skinId: selectedSkinId })
        });

        const data = await response.json();

        if (data.success) {
            skinEquipada = selectedSkinId;

            // Actualizar caché local para que el perfil cargue esta nave de inmediato
            savedPlayer.currentSkin = skinEquipada;
            localStorage.setItem("player", JSON.stringify(savedPlayer));

            render();

            if (toast) {
                toast.textContent = "¡Nave equipada!";
                toast.classList.add("show");
                setTimeout(() => toast.classList.remove("show"), 1500);
            }
        } else {
            alert("No se pudo equipar la nave.");
        }
    } catch (error) {
        console.error("Error al equipar nave:", error);
    }
});

// Guardar look o salir
const saveBtn = document.querySelector("#saveBtn");
if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        location.href = "profile.html";
    });
}

// Inicializar
cargarInventario();