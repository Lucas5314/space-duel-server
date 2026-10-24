// ==========================================
// ECONOMY - COINS
// ==========================================

const db = require("../database/db");

// ==========================================
// OBTENER MONEDAS DEL JUGADOR
// ==========================================

async function getCoins(playerId) {

    const result = await db.query(
        `
        SELECT coins
        FROM players
        WHERE id = $1
        `,
        [playerId]
    );

    if(result.rows.length === 0){
        throw new Error("PLAYER_NOT_FOUND");
    }

    return result.rows[0].coins;
}


// ==========================================
// AGREGAR MONEDAS
// ==========================================

async function addCoins(playerId, amount) {

    if(!Number.isInteger(amount) || amount <= 0){
        throw new Error("INVALID_COIN_AMOUNT");
    }

    const result = await db.query(
        `
        UPDATE players
        SET coins = coins + $1
        WHERE id = $2
        RETURNING coins
        `,
        [
            amount,
            playerId
        ]
    );

    if(result.rows.length === 0){
        throw new Error("PLAYER_NOT_FOUND");
    }

    return result.rows[0].coins;
}


// ==========================================
// GASTAR MONEDAS
// ==========================================

async function spendCoins(playerId, amount) {

    if(!Number.isInteger(amount) || amount <= 0){
        throw new Error("INVALID_COIN_AMOUNT");
    }

    const result = await db.query(
        `
        UPDATE players
        SET coins = coins - $1
        WHERE id = $2
        AND coins >= $1
        RETURNING coins
        `,
        [
            amount,
            playerId
        ]
    );

    if(result.rows.length === 0){

        throw new Error("INSUFFICIENT_COINS");

    }

    return result.rows[0].coins;
}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getCoins,
    addCoins,
    spendCoins

};