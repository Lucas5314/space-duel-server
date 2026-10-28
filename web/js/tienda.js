// =========================
// TIENDA DE MONEDAS
// =========================

const { NativePurchases } = Capacitor.Plugins;

const PURCHASE_TYPE = {
    INAPP: "inapp",
    SUBS: "subs"
};

console.log("🔥 TIENDA.JS CARGADO");
console.log("🔥 NativePurchases:", NativePurchases);
console.log("🔥 PURCHASE_TYPE:", PURCHASE_TYPE);


// =========================
// SONIDO
// =========================

const clickSound =
    new Audio("assets/audio/click.m4a");

clickSound.volume = 0.4;


// =========================
// DATOS
// =========================

const API_URL =
    "https://space-duel-server-1.onrender.com";

const playerId =
    Number(localStorage.getItem("playerId"));


// =========================
// PRODUCTOS
// =========================

const PRODUCT_IDS = [
    "skin_nave_roja", // <-- Cambiado de "coins_300" al ID real de Google Play
    "coins_600",
    "coins_1200"
];


// =========================
// ELEMENTOS
// =========================

const coinsAmount =
    document.getElementById("coinsAmount");

const buyButtons =
    document.querySelectorAll(".buyButton");
    let billingReady = false;
const availableProductIds = new Set();

const backBtn =
    document.getElementById("backBtn");


// =========================
// CARGAR MONEDAS
// =========================

async function cargarMonedas() {

    if (!Number.isInteger(playerId)) {

        console.log(
            "No hay playerId válido."
        );

        coinsAmount.textContent = "0";

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/player/${playerId}/coins`
            );

        const data =
            await response.json();

        if (data.success) {

            coinsAmount.textContent =
                data.coins;

        } else {

            console.log(
                "Error obteniendo monedas:",
                data.error
            );
        }

    } catch (error) {

        console.log(
            "Error conectando con servidor:",
            error
        );
    }
}


// =========================
// COMPROBAR GOOGLE PLAY
// =========================

async function comprobarGooglePlay() {

    console.log(
        "🔥 COMPROBANDO GOOGLE PLAY..."
    );

    try {

        const {
            isBillingSupported
        } =
            await NativePurchases
                .isBillingSupported();

        console.log(
            "🔥 Google Play Billing:",
            isBillingSupported
        );

        if (!isBillingSupported) {

            console.error(
                "❌ Google Play Billing NO disponible."
            );

            return false;
        }

        console.log(
            "✅ Google Play Billing disponible."
        );

        return true;

    } catch (error) {

        console.error(
            "❌ Error comprobando Google Play:",
            error
        );

        return false;
    }
}


// =========================
// CARGAR PRODUCTOS
// =========================

async function cargarProductos() {

    console.log(
        "🔥 CARGANDO PRODUCTOS..."
    );

    try {

        const {
            products
        } =
            await NativePurchases.getProducts({

                productIdentifiers:
                    PRODUCT_IDS,

                productType:
                    PURCHASE_TYPE.INAPP

            });

        console.log(
            "🔥 Productos de Google Play:",
            products
        );

        products.forEach(product => {

            availableProductIds.add(product.identifier);

            const button =
                document.querySelector(
                    `[data-product="${product.identifier}"]`
                );

            if (!button) {
                return;
            }

            if (product.priceString) {

                button.textContent =
                    product.priceString;
            }

            button.disabled = false;

        });

    } catch (error) {

        console.error(
            "❌ Error cargando productos:",
            error
        );
    }
}


// =========================
// COMPRAR MONEDAS
// =========================

async function comprarMonedas(productId) {

    console.log(
        "🔥🔥 CLICK COMPRAR:",
        productId
    );

    try {
        if (!billingReady || !availableProductIds.has(productId)) {
    console.error("Billing no está listo o Google Play no encontró el producto.");
    return;
}

        // -------------------------
        // VALIDAR PLAYER
        // -------------------------

        if (!Number.isInteger(playerId)) {

            alert(
                "No se encontró el jugador."
            );

            return;
        }


        // -------------------------
        // VALIDAR PRODUCTO
        // -------------------------

        if (!PRODUCT_IDS.includes(productId)) {

            console.error(
                "❌ Producto no válido:",
                productId
            );

            return;
        }


        // -------------------------
        // SONIDO
        // -------------------------

        clickSound.currentTime = 0;

        clickSound
            .play()
            .catch(() => {});


        console.log(
            "🔥 Iniciando compra:",
            productId
        );


        // -------------------------
        // GOOGLE PLAY
        // -------------------------

        console.log(
            "🔥 Llamando a NativePurchases.purchaseProduct..."
        );

        const transaction =
            await NativePurchases.purchaseProduct({

                productIdentifier:
                    productId,

                productType:
                    PURCHASE_TYPE.INAPP,

                quantity: 1,

                isConsumable: true,

                autoAcknowledgePurchases: false

            });


        console.log(
            "✅ TRANSACCIÓN RECIBIDA:",
            transaction
        );


        // -------------------------
        // PURCHASE TOKEN
        // -------------------------

        const purchaseToken =
            transaction.purchaseToken;

        console.log(
            "🔥 Purchase token:",
            purchaseToken
                ? "RECIBIDO"
                : "NO RECIBIDO"
        );


        if (!purchaseToken) {

            throw new Error(
                "GOOGLE_PURCHASE_TOKEN_MISSING"
            );
        }


        // -------------------------
        // ENVIAR AL SERVIDOR
        // -------------------------

        console.log(
            "🔥 Enviando compra al servidor..."
        );

        const response =
            await fetch(
                `${API_URL}/api/purchases/google`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        playerId:
                            playerId,

                        productId:
                            productId,

                        purchaseToken:
                            purchaseToken

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "🔥 Respuesta del servidor:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "PURCHASE_VALIDATION_FAILED"
            );
        }


        // -------------------------
        // ACTUALIZAR SALDO
        // -------------------------

        if (
            typeof data.coins ===
            "number"
        ) {

            coinsAmount.textContent =
                data.coins;

        } else {

            await cargarMonedas();
        }


        alert(
            "¡Compra realizada correctamente!"
        );


    } catch (error) {

        console.error(
            "❌ ERROR EN LA COMPRA:",
            error
        );


        if (
            error?.message ===
            "USER_CANCELED"
        ) {

            console.log(
                "Compra cancelada."
            );

            return;
        }


        alert(
            "No se pudo completar la compra."
        );


    } finally {

        buyButtons.forEach(button => {

            button.disabled =
    !billingReady ||
    !availableProductIds.has(button.dataset.product);

        });
    }
}


// =========================
// BOTONES DE COMPRA
// =========================

buyButtons.forEach(button => {

    // IMPORTANTE:
    // Durante esta prueba NO los bloqueamos.

    button.disabled = true;


    button.addEventListener(
        "click",
        () => {

            const productId =
                button.dataset.product;

            comprarMonedas(
                productId
            );

        }
    );
});


// =========================
// VOLVER
// =========================

backBtn.addEventListener(
    "click",
    () => {

        clickSound.currentTime = 0;

        clickSound
            .play()
            .catch(() => {});

        location.href =
            "profile.html";
    }
);


// =========================
// INICIO
// =========================

async function iniciarTienda() {

    console.log(
        "🔥 INICIANDO TIENDA"
    );

    await cargarMonedas();

    const disponible =
        await comprobarGooglePlay();


    console.log(
        "🔥 BILLING DISPONIBLE:",
        disponible
    );

    if (!disponible) {

        console.error(
            "❌ GOOGLE PLAY BILLING NO DISPONIBLE"
        );

        return;
    }
    billingReady = true;

    await cargarProductos();
}


iniciarTienda();