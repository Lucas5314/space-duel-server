const { google } = require("googleapis");

const PACKAGE_NAME = process.env.GOOGLE_PLAY_PACKAGE_NAME || "com.lucas.spacetip.duel";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
            ?.replace(/\\n/g, "\n")
    },
    scopes: [
        "https://www.googleapis.com/auth/androidpublisher"
    ]
});

const androidPublisher = google.androidpublisher({
    version: "v3",
    auth
});
console.log("🔥 GOOGLE PLAY CONFIG:");
console.log("PACKAGE NAME:", PACKAGE_NAME);
console.log(
    "SERVICE ACCOUNT EMAIL:",
    !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
);
console.log(
    "PRIVATE KEY:",
    !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
);

async function getProductPurchase(productId, purchaseToken) {
console.log("🔥 VERIFICANDO PARÁMETROS:");
console.log("PACKAGE:", PACKAGE_NAME);
console.log("PRODUCT:", productId);
console.log("TOKEN RECIBIDO:", !!purchaseToken);
    const response =
        await androidPublisher.purchases.products.get({
            packageName: PACKAGE_NAME,
            productId,
            token: purchaseToken
        });

    return response.data;
}

async function consumeProduct(productId, purchaseToken) {

    const response =
        await androidPublisher.purchases.products.consume({
            packageName: PACKAGE_NAME,
            productId,
            token: purchaseToken
        });

    return response.data;
}

// ======================================
// CONFIRMAR COMPRA NO CONSUMIBLE
// ======================================

async function acknowledgeProduct(productId, purchaseToken) {

    const response =
        await androidPublisher.purchases.products.acknowledge({
            packageName: PACKAGE_NAME,
            productId,
            token: purchaseToken
        });

    return response.data;
}

module.exports = {
    getProductPurchase,
    consumeProduct,
    acknowledgeProduct
};