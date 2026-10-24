const { google } = require("googleapis");

const PACKAGE_NAME = process.env.GOOGLE_PLAY_PACKAGE_NAME;

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


async function getProductPurchase(productId, purchaseToken) {

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


module.exports = {
    getProductPurchase,
    consumeProduct
};