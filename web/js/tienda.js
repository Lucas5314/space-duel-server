// =========================
// TIENDA DE MONEDAS
// =========================

const { NativePurchases } = Capacitor.Plugins;

const PURCHASE_TYPE = {
    INAPP: "inapp",
    SUBS: "subs"
};

console.log("🔥 TIENDA.JS CARGADO");

// =========================
// SONIDO
// =========================

const clickSound = new Audio("assets/audio/click.m4a");
clickSound.volume = 0.4;

// =========================
// DATOS Y SESIÓN
// =========================

const API_URL = "https://space-duel-server-1.onrender.com";

const savedPlayer = JSON.parse(localStorage.getItem("player"));
const playerId = savedPlayer ? Number(savedPlayer.id) : null;

if (!playerId) {
    console.warn("⚠️ No hay sesión activa, redirigiendo a createplayer...");
    location.href = "createplayer.html";
}

// =========================
// PRODUCTOS
// =========================

const PRODUCT_IDS = [
    "600"
];

const CONSUMABLE_IDS = new Set([
    "600"
]);

// =========================
// ELEMENTOS
// =========================

const coinsAmount = document.getElementById("coinsAmount");
const buyButtons = document.querySelectorAll(".buyButton");
let billingReady = false;
let purchaseInProgress = false;
const availableProductIds = new Set();

const backBtn = document.getElementById("backBtn");

function refreshBuyButtonsState() {
    buyButtons.forEach(button => {
        const prodId = button.dataset.product;
        button.disabled = purchaseInProgress || !billingReady || !availableProductIds.has(prodId);
    });
}

// =========================
// CARGAR MONEDAS
// =========================

async function cargarMonedas() {
    if (!Number.isInteger(playerId)) {
        console.log("No hay playerId válido.");
        if (coinsAmount) coinsAmount.textContent = "0";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/player/${playerId}/coins`);
        const data = await response.json();

        if (data.success) {
            if (coinsAmount) coinsAmount.textContent = data.coins;

            if (savedPlayer) {
                savedPlayer.coins = data.coins;
                localStorage.setItem("player", JSON.stringify(savedPlayer));
            }
        } else {
            console.log("Error obteniendo monedas:", data.error);
        }
    } catch (error) {
        console.log("Error conectando con servidor:", error);
    }
}

// =========================
// COMPROBAR GOOGLE PLAY
// =========================

async function comprobarGooglePlay() {
    console.log("🔥 COMPROBANDO GOOGLE PLAY...");

    try {
        const { isBillingSupported } = await NativePurchases.isBillingSupported();
        console.log("🔥 Google Play Billing:", isBillingSupported);

        if (!isBillingSupported) {
            console.error("❌ Google Play Billing NO disponible.");
            return false;
        }

        console.log("✅ Google Play Billing disponible.");
        return true;
    } catch (error) {
        console.error("❌ Error comprobando Google Play:", error);
        return false;
    }
}

// =========================
// CARGAR PRODUCTOS
// =========================

async function cargarProductos() {
    console.log("🔥 CARGANDO PRODUCTOS...");

    try {
        const { products } = await NativePurchases.getProducts({
            productIdentifiers: PRODUCT_IDS,
            productType: PURCHASE_TYPE.INAPP
        });

        console.log("🔥 Productos de Google Play:", JSON.stringify(products));

        products.forEach(product => {
            availableProductIds.add(product.identifier);

            const button = document.querySelector(`[data-product="${product.identifier}"]`);
            if (!button) return;

            if (product.priceString) {
                button.textContent = product.priceString;
            }
        });

        refreshBuyButtonsState();

    } catch (error) {
        console.error("❌ Error cargando productos:", error);
    }
}

// =========================
// COMPRAR MONEDAS
// =========================

async function comprarMonedas(productId) {
    console.log("🔥🔥 CLICK COMPRAR:", productId);

    if (purchaseInProgress) return;

    try {
        if (!billingReady || !availableProductIds.has(productId)) {
            console.error("Billing no está listo o Google Play no encontró el producto.");
            alert("La tienda no está lista o el producto no está disponible.");
            return;
        }

        if (!Number.isInteger(playerId)) {
            alert("No se encontró el ID del jugador.");
            return;
        }

        if (!PRODUCT_IDS.includes(productId)) {
            console.error("❌ Producto no válido:", productId);
            return;
        }

        purchaseInProgress = true;
        refreshBuyButtonsState();

        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});

        const isConsumable = CONSUMABLE_IDS.has(productId);
        console.log("🔥 Iniciando compra:", productId, "| isConsumable:", isConsumable);

        const transaction = await NativePurchases.purchaseProduct({
            productIdentifier: productId,
            productType: PURCHASE_TYPE.INAPP,
            quantity: 1,
            isConsumable: isConsumable,
            autoAcknowledgePurchases: false
        });

        console.log("✅ TRANSACCIÓN RECIBIDA:", JSON.stringify(transaction));

        const purchaseToken = transaction?.purchaseToken || transaction?.token;
        if (!purchaseToken) {
            throw new Error("GOOGLE_PURCHASE_TOKEN_MISSING");
        }

        console.log("🔥 Enviando compra al servidor en Render...");

        const response = await fetch(`${API_URL}/api/purchases/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                playerId: playerId,
                productId: productId,
                purchaseToken: purchaseToken
            })
        });

        const data = await response.json();
        console.log("🔥 Respuesta del servidor:", JSON.stringify(data));

        if (!response.ok || !data.success) {
            throw new Error(data.error || "PURCHASE_VALIDATION_FAILED");
        }

        // Si el plugin expone consumePurchase, consumimos para liberar el SKU consumible
        if (isConsumable && typeof NativePurchases.consumePurchase === "function") {
            try {
                await NativePurchases.consumePurchase({ purchaseToken });
                console.log("✅ Compra consumida en Google Play.");
            } catch (consumeErr) {
                console.warn("⚠️ No se pudo consumir desde el cliente:", consumeErr);
            }
        }

        if (typeof data.coins === "number") {
            if (coinsAmount) coinsAmount.textContent = data.coins;
            if (savedPlayer) {
                savedPlayer.coins = data.coins;
                localStorage.setItem("player", JSON.stringify(savedPlayer));
            }
        } else {
            await cargarMonedas();
        }

        alert("¡Compra realizada correctamente!");

    } catch (error) {
        console.error("❌ ERROR EN LA COMPRA:", error?.message || error);

        if (error?.message === "USER_CANCELED") {
            console.log("Compra cancelada.");
            return;
        }

        alert(`No se pudo completar la compra (${error?.message || "ERROR"}).`);

    } finally {
        purchaseInProgress = false;
        refreshBuyButtonsState();
    }
}

// =========================
// BOTONES DE COMPRA
// =========================

buyButtons.forEach(button => {
    button.disabled = true;

    button.addEventListener("click", () => {
        const productId = button.dataset.product;
        comprarMonedas(productId);
    });
});

// =========================
// VOLVER
// =========================

if (backBtn) {
    backBtn.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
        location.href = "profile.html";
    });
}

// =========================
// INICIO
// =========================

async function iniciarTienda() {
    console.log("🔥 INICIANDO TIENDA");

    await cargarMonedas();

    const disponible = await comprobarGooglePlay();
    console.log("🔥 BILLING DISPONIBLE:", disponible);

    if (!disponible) {
        console.error("❌ GOOGLE PLAY BILLING NO DISPONIBLE");
        return;
    }

    billingReady = true;
    await cargarProductos();
}

iniciarTienda();