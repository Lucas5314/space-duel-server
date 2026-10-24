const db = require("../database/db");

async function hasPurchaseToken(purchaseToken) {
    const result = await db.query(
        `SELECT 1
         FROM google_purchases
         WHERE purchase_token = $1
         LIMIT 1`,
        [purchaseToken]
    );

    return result.rows.length > 0;
}

async function registerPurchase({
    playerId,
    productId,
    purchaseToken,
    coins
}) {
    const result = await db.query(
        `INSERT INTO google_purchases
            (player_id, product_id, purchase_token, coins)
         VALUES
            ($1, $2, $3, $4)
         ON CONFLICT (purchase_token)
         DO NOTHING
         RETURNING *`,
        [
            playerId,
            productId,
            purchaseToken,
            coins
        ]
    );

    if (result.rows.length === 0) {
        return {
            created: false,
            purchase: null
        };
    }

    return {
        created: true,
        purchase: result.rows[0]
    };
}

module.exports = {
    hasPurchaseToken,
    registerPurchase
};