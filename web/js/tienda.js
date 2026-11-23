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
const PENDING_PURCHASE_KEY = "pending_google_purchase_603";

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
    "603"
];

const CONSUMABLE_IDS = new Set([
    "603"
]);

// =========================
// ELEMENTOS
// =========================

const coinsAmount = document.getElementById("coinsAmount");
const buyButtons = document.querySelectorAll(".buyButton");
let billingReady = false;
let purchaseInProgress = false;
let syncInFlight = null;
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
// VALIDAR Y CONSUMIR COMPRA
// =========================

async function procesarTokenEnBackendYConsumir(productId, purchaseToken) {
    if (!purchaseToken) {
        throw new Error("GOOGLE_PURCHASE_TOKEN_MISSING");
    }

    console.log("🔥 Enviando compra al servidor en Render...", { productId, playerId });

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

    const isConsumable = CONSUMABLE_IDS.has(productId);
    if (isConsumable && typeof NativePurchases.consumePurchase === "function") {
        try {
            await NativePurchases.consumePurchase({ purchaseToken });
            console.log("✅ Compra consumida en Google Play:", productId);
        } catch (consumeErr) {
            console.warn("⚠️ No se pudo consumir desde el cliente:", consumeErr);
        }
    }

    localStorage.removeItem(PENDING_PURCHASE_KEY);

    if (typeof data.coins === "number") {
        if (coinsAmount) coinsAmount.textContent = data.coins;
        if (savedPlayer) {
            savedPlayer.coins = data.coins;
            localStorage.setItem("player", JSON.stringify(savedPlayer));
        }
    } else {
        await cargarMonedas();
    }

    return data;
}

async function recuperarComprasPendientes(mostrarAlertaSiAplica = false) {
    if (!Number.isInteger(playerId)) return false;

    const getPurchasesFn =
        typeof NativePurchases.getPurchases === "function"
            ? NativePurchases.getPurchases.bind(NativePurchases)
            : typeof NativePurchases.queryPurchases === "function"
              ? NativePurchases.queryPurchases.bind(NativePurchases)
              : null;

    if (!getPurchasesFn) {
        console.warn("⚠️ El plugin no expone getPurchases / queryPurchases.");
        return false;
    }

    try {
        console.log("🔍 Revisando compras existentes/pendientes en Google Play...");
        const res = await getPurchasesFn({
            productType: PURCHASE_TYPE.INAPP
        });

        const purchases = Array.isArray(res?.purchases)
            ? res.purchases
            : Array.isArray(res)
              ? res
              : [];

        console.log("📦 Compras encontradas en Play:", JSON.stringify(purchases));
        alert("GET_PURCHASES:\n\n" + JSON.stringify(purchases, null, 2));

        let procesadaAlguna = false;

        for (const p of purchases) {
            const prodId = String(p?.productIdentifier || p?.productId || p?.sku || "");
            const token = p?.purchaseToken || p?.token;
            const state = p?.purchaseState;

            if (!PRODUCT_IDS.includes(prodId) || !token) continue;

            if (state === 1 || state === "PENDING" || state === "pending") {
                console.log("⏳ Compra aún pendiente en Google Play:", prodId);
                continue;
            }

            await procesarTokenEnBackendYConsumir(prodId, token);
            procesadaAlguna = true;
        }

        if (procesadaAlguna && mostrarAlertaSiAplica) {
            alert("¡Compra acreditada y monedas actualizadas!");
        }

        return procesadaAlguna;
    } catch (err) {
        console.warn("⚠️ Error revisando compras pendientes:", err?.message || err);
        return false;
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

        localStorage.setItem(
            PENDING_PURCHASE_KEY,
            JSON.stringify({ productId, playerId, ts: Date.now() })
        );

        const isConsumable = CONSUMABLE_IDS.has(productId);
        console.log("🔥 Iniciando compra:", productId, "| isConsumable:", isConsumable);

        const transaction = await NativePurchases.purchaseProduct({
            productIdentifier: productId,
            productType: PURCHASE_TYPE.INAPP,
            quantity: 1,
            isConsumable: isConsumable,
            autoAcknowledgePurchases: false
        });
        // MOSTRAR RESPUESTA REAL DE GOOGLE PLAY
console.log("🔥 OBJETO COMPLETO:", transaction);

alert(
    "RESPUESTA DE GOOGLE PLAY:\n\n" +
    JSON.stringify(transaction, null, 2)
);

// COMPROBAR LOS CAMPOS
alert(
    "purchaseToken: " + transaction?.purchaseToken +
    "\ntoken: " + transaction?.token +
    "\ntransactionIdentifier: " + transaction?.transactionIdentifier
);

        console.log("✅ TRANSACCIÓN RECIBIDA:", JSON.stringify(transaction));

        const purchaseToken = transaction?.purchaseToken || transaction?.token;
        await procesarTokenEnBackendYConsumir(productId, purchaseToken);

        alert("¡Compra realizada correctamente!");

    } catch (error) {
        const msg = String(error?.message || error || "");
        console.error("❌ ERROR EN LA COMPRA:", msg);

        if (msg.includes("USER_CANCELED")) {
            localStorage.removeItem(PENDING_PURCHASE_KEY);
            console.log("Compra cancelada.");
            return;
        }

        if (msg.includes("ITEM_ALREADY_OWNED") || msg.includes("7")) {
            console.log("♻️ Detectado ITEM_ALREADY_OWNED, intentando recuperar y consumir compra...");
            const recuperada = await recuperarComprasPendientes(true);
            if (recuperada) {
                return;
            }
        }

        alert(`No se pudo completar la compra (${msg || "ERROR"}).`);

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
// RE-SINCRONIZACIÓN AL VOLVER
// =========================

async function sincronizarAlVolver(mostrarAlerta = true) {
    if (syncInFlight) return syncInFlight;

    syncInFlight = (async () => {
        try {
            console.log("🔄 App volvió al frente, re-sincronizando tienda...");
            await cargarMonedas();
            if (billingReady) {
                await recuperarComprasPendientes(mostrarAlerta);
            }
        } finally {
            syncInFlight = null;
        }
    })();

    return syncInFlight;
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        sincronizarAlVolver(true);
    }
});

if (Capacitor?.Plugins?.App?.addListener) {
    Capacitor.Plugins.App.addListener("appStateChange", ({ isActive }) => {
        if (isActive) {
            sincronizarAlVolver(true);
        }
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
    await recuperarComprasPendientes(true);
}

iniciarTienda();