
// ==========================================
// LAUGH BATTLES - SISTEMA DE SKINS
// ==========================================


// ==========================================
// CONFIGURACIÓN
// ==========================================

const API_URL =
    "https://space-duel-server-1.onrender.com";


// ==========================================
// SONIDO
// ==========================================

const clickSound =
    new Audio("assets/audio/click.mp3");

clickSound.volume = 0.4;


// ==========================================
// RAREZAS
// ==========================================

const rarityImages = {

    "Común":
        "assets/icons/comun.png",

    "Rara":
        "assets/icons/raro.png",

    "Épica":
        "assets/icons/epico.png",

    "Legendaria":
        "assets/icons/legendario.png",

    "Mítica":
        "assets/icons/mitico.png"

};


// ==========================================
// CATÁLOGO VISUAL
// ==========================================

const skins = [

    {
        id: "nave1",
        nombre: "Nave Azul",
        imagen: "assets/icons/nave1.png",
        rareza: "Común",
        tipo: "gratis"
    },

    {
        id: "nave2",
        nombre: "Nave Roja",
        imagen: "assets/icons/nave2.png",
        rareza: "Rara",
        tipo: "compra"
    },

    {
        id: "nave3",
        nombre: "Nave Dorada",
        imagen: "assets/icons/naveee1.png",
        rareza: "Épica",
        tipo: "compra"
    },

    {
        id: "nave4",
        nombre: "Nave Galaxia",
        imagen: "assets/icons/naveee1.png",
        rareza: "Rara",
        tipo: "compra"
    },

    {
        id: "nave5",
        nombre: "Nave Eclipse",
        imagen: "assets/icons/naveee1.png",
        rareza: "Legendaria",
        tipo: "compra"
    },

    {
        id: "nave6",
        nombre: "Nave Fénix",
        imagen: "assets/icons/naveee1.png",
        rareza: "Épica",
        tipo: "compra"
    },

    {
        id: "nave7",
        nombre: "Nave Plasma",
        imagen: "assets/icons/naveee1.png",
        rareza: "Rara",
        tipo: "compra"
    },

    {
        id: "nave8",
        nombre: "Nave Nebulosa",
        imagen: "assets/icons/naveee1.png",
        rareza: "Legendaria",
        tipo: "compra"
    },

    {
        id: "nave9",
        nombre: "Nave Cometa",
        imagen: "assets/icons/naveee1.png",
        rareza: "Común",
        tipo: "compra"
    },

    {
        id: "nave10",
        nombre: "Nave Aurora",
        imagen: "assets/icons/naveee1.png",
        rareza: "Épica",
        tipo: "compra"
    },

    {
        id: "nave11",
        nombre: "Nave Titan",
        imagen: "assets/icons/naveee1.png",
        rareza: "Rara",
        tipo: "compra"
    },

    {
        id: "nave12",
        nombre: "Nave Omega",
        imagen: "assets/icons/naveee1.png",
        rareza: "Legendaria",
        tipo: "compra"
    },

    {
        id: "nave13",
        nombre: "Nave Solar",
        imagen: "assets/icons/naveee1.png",
        rareza: "Épica",
        tipo: "compra"
    },

    {
        id: "nave14",
        nombre: "Nave Lunar",
        imagen: "assets/icons/naveee1.png",
        rareza: "Rara",
        tipo: "compra"
    },

    {
        id: "nave15",
        nombre: "Nave Void",
        imagen: "assets/icons/naveee1.png",
        rareza: "Legendaria",
        tipo: "compra"
    },

    {
        id: "nave16",
        nombre: "Nave Neon",
        imagen: "assets/icons/naveee1.png",
        rareza: "Épica",
        tipo: "compra"
    },

    {
        id: "nave17",
        nombre: "Nave Hunter",
        imagen: "assets/icons/naveee1.png",
        rareza: "Rara",
        tipo: "compra"
    },

    {
        id: "nave18",
        nombre: "Nave Dragon",
        imagen: "assets/icons/naveee1.png",
        rareza: "Legendaria",
        tipo: "compra"
    },

    {
        id: "nave19",
        nombre: "Nave Shadow",
        imagen: "assets/icons/naveee1.png",
        rareza: "Épica",
        tipo: "compra"
    },

    {
        id: "nave20",
        nombre: "Nave Legendaria",
        imagen: "assets/icons/naveee1.png",
        rareza: "Mítica",
        tipo: "compra"
    }

];


// ==========================================
// ELEMENTOS
// ==========================================

const container =
    document.getElementById("skinsContainer");


// ==========================================
// ESTADO DEL JUGADOR
// ==========================================

const playerId =
    Number(localStorage.getItem("playerId"));

let monedas = 0;

let skinsPoseidas = [];

let equipada = "nave1";


// ==========================================
// VERIFICAR SI POSEE UNA SKIN
// ==========================================

function poseeSkin(skinId) {

    // Nave inicial
    if (skinId === "nave1") {
        return true;
    }

    return skinsPoseidas.includes(skinId);
}


// ==========================================
// OBTENER PRECIO
// ==========================================

function getSkinPrice(skinId) {

    const precios = {

        nave2: 300,
        nave3: 600,
        nave4: 300,
        nave5: 1000,
        nave6: 600,
        nave7: 300,
        nave8: 1000,
        nave9: 100,
        nave10: 600,
        nave11: 300,
        nave12: 1000,
        nave13: 600,
        nave14: 300,
        nave15: 1000,
        nave16: 600,
        nave17: 300,
        nave18: 1000,
        nave19: 600,
        nave20: 2000

    };

    return precios[skinId] || 0;
}


// ==========================================
// RENDER
// ==========================================

function render() {

    if (!container) {

        console.error(
            "❌ No existe #skinsContainer."
        );

        return;
    }


    container.innerHTML = "";


    skins.forEach(skin => {

        const card =
            document.createElement("div");

        card.className = "card";


        // ----------------------------------
        // ABRIR FICHA
        // ----------------------------------

        card.onclick = () => {

            location.href =
                "paginaskin.html?id=" +
                skin.id;

        };


        // ----------------------------------
        // ESTADO
        // ----------------------------------

        const poseida =
            poseeSkin(skin.id);


        let boton;


        if (poseida) {

            boton =
                skin.id === equipada
                    ? "Equipada"
                    : "Equipar";

        } else {

            boton =
                `Comprar ${getSkinPrice(skin.id)} 🪙`;
        }


        // ----------------------------------
        // CARD
        // ----------------------------------

        card.innerHTML = `

            <img
                class="rarityBadge"
                src="${rarityImages[skin.rareza]}"
                alt="${skin.rareza}"
            >

            <h2>
                ${skin.nombre}
            </h2>

            <img
                src="${skin.imagen}"
                alt="${skin.nombre}"
            >

            <button
                data-id="${skin.id}"
            >
                ${boton}
            </button>

        `;


        container.appendChild(card);

    });


    // ======================================
    // BOTONES
    // ======================================

    document
        .querySelectorAll("button[data-id]")
        .forEach(btn => {

            btn.onclick = async (e) => {

                e.stopPropagation();


                clickSound.currentTime = 0;

                clickSound.play().catch(() => {});


                const skin =
                    skins.find(
                        s =>
                            s.id ===
                            btn.dataset.id
                    );


                if (!skin) {
                    return;
                }


                // --------------------------------
                // YA EQUIPADA
                // --------------------------------

                if (skin.id === equipada) {
                    return;
                }


                // --------------------------------
                // EQUIPAR
                // --------------------------------

                if (poseeSkin(skin.id)) {

                    await equiparSkin(
                        skin.id
                    );

                    return;
                }


                // --------------------------------
                // NAVE GRATIS
                // --------------------------------

                if (skin.tipo === "gratis") {

                    equipada = skin.id;

                    render();

                    return;
                }


                // --------------------------------
                // COMPRAR
                // --------------------------------

                await comprarSkin(
                    skin
                );

            };

        });

}


// ==========================================
// CARGAR DATOS DEL JUGADOR
// ==========================================

async function cargarDatosJugador() {

    if (!Number.isInteger(playerId)) {

        console.warn(
            "⚠️ No existe un playerId válido."
        );

        return;
    }


    try {

        // ==================================
        // MONEDAS
        // ==================================

        const coinsResponse =
            await fetch(
                `${API_URL}/api/player/${playerId}/coins`
            );


        if (!coinsResponse.ok) {
            throw new Error(
                "COINS_REQUEST_FAILED"
            );
        }


        const coinsData =
            await coinsResponse.json();


        if (coinsData.success) {

            monedas =
                Number(
                    coinsData.coins
                ) || 0;

        }


        // ==================================
        // INVENTARIO
        // ==================================

        const inventoryResponse =
            await fetch(
                `${API_URL}/api/player/${playerId}/skins`
            );


        if (!inventoryResponse.ok) {
            throw new Error(
                "INVENTORY_REQUEST_FAILED"
            );
        }


        const inventoryData =
            await inventoryResponse.json();


        if (inventoryData.success) {

            skinsPoseidas =
                Array.isArray(
                    inventoryData.skins
                )
                    ? inventoryData.skins
                    : [];


            if (inventoryData.equipada) {

                equipada =
                    inventoryData.equipada;

            }

        }


        // Actualizar interfaz
        render();

    }


    catch (error) {

        console.error(
            "ERROR CARGANDO DATOS:",
            error
        );

        // IMPORTANTE:
        // Si el servidor/DB falla,
        // NO dejamos la página en blanco.
        // El catálogo ya fue renderizado.

        render();
    }

}


// ==========================================
// COMPRAR SKIN
// ==========================================

async function comprarSkin(skin) {

    if (!Number.isInteger(playerId)) {

        alert(
            "No se encontró el jugador."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/skins/purchase`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        playerId: playerId,

                        skinId: skin.id

                    })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            if (
                data.error ===
                "INSUFFICIENT_COINS"
            ) {

                alert(
                    "No tienes suficientes monedas."
                );

            }

            else if (
                data.error ===
                "SKIN_ALREADY_OWNED"
            ) {

                alert(
                    "Ya tienes esta skin."
                );

            }

            else if (
                data.error ===
                "SKIN_NOT_FOUND"
            ) {

                alert(
                    "Esta skin no existe."
                );

            }

            else if (
                data.error ===
                "SKIN_NOT_PURCHASABLE"
            ) {

                alert(
                    "Esta skin no se puede comprar."
                );

            }

            else {

                alert(
                    "No se pudo realizar la compra."
                );

            }

            return;
        }


        // ==================================
        // ACTUALIZAR MONEDAS
        // ==================================

        if (
            data.purchase &&
            data.purchase.coins !== undefined
        ) {

            monedas =
                Number(
                    data.purchase.coins
                );

        }


        // ==================================
        // AÑADIR SKIN
        // ==================================

        if (
            !skinsPoseidas.includes(
                skin.id
            )
        ) {

            skinsPoseidas.push(
                skin.id
            );

        }


        alert(
            `${skin.nombre} comprada correctamente.`
        );


        render();

    }


    catch (error) {

        console.error(
            "ERROR COMPRANDO SKIN:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ==========================================
// EQUIPAR SKIN
// ==========================================

async function equiparSkin(skinId) {

    if (!Number.isInteger(playerId)) {

        alert(
            "No se encontró el jugador."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/player/${playerId}/skins/equip`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        skinId: skinId

                    })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            if (
                data.error ===
                "SKIN_NOT_OWNED"
            ) {

                alert(
                    "No tienes esta skin."
                );

            }

            else {

                alert(
                    "No se pudo equipar la skin."
                );

            }

            return;
        }


        equipada =
            skinId;


        render();

    }


    catch (error) {

        console.error(
            "ERROR EQUIPANDO SKIN:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}


// ==========================================
// INICIO
// ==========================================

// IMPORTANTE:
// Renderizamos PRIMERO.
// No esperamos a PostgreSQL.

render();


// Después intentamos obtener
// monedas e inventario.

cargarDatosJugador();


// ==========================================
// BOTÓN ATRÁS
// ==========================================

const backButton =
    document.getElementById("back");


if (backButton) {

    backButton.onclick = () => {

        clickSound.currentTime = 0;

        clickSound.play().catch(() => {});


        setTimeout(() => {

            location.href =
                "profile.html";

        }, 120);

    };

}
