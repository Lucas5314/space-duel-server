
const db = require("../database/db");
const inventory = require("./inventory");


// ======================================================
// CATÁLOGO DE SKINS
// ======================================================

const skins = {

    nave1: {
        nombre: "Nave Azul",
        rareza: "Común",
        precio: 0
    },

    nave2: {
        nombre: "Nave Roja",
        rareza: "Rara",
        precio: 300
    },

    nave3: {
        nombre: "Nave Dorada",
        rareza: "Épica",
        precio: 600
    },

    nave4: {
        nombre: "Nave Galaxia",
        rareza: "Rara",
        precio: 300
    },

    nave5: {
        nombre: "Nave Eclipse",
        rareza: "Legendaria",
        precio: 1000
    },

    nave6: {
        nombre: "Nave Fénix",
        rareza: "Épica",
        precio: 600
    },

    nave7: {
        nombre: "Nave Plasma",
        rareza: "Rara",
        precio: 300
    },

    nave8: {
        nombre: "Nave Nebulosa",
        rareza: "Legendaria",
        precio: 1000
    },

    nave9: {
        nombre: "Nave Cometa",
        rareza: "Común",
        precio: 100
    },

    nave10: {
        nombre: "Nave Aurora",
        rareza: "Épica",
        precio: 600
    },

    nave11: {
        nombre: "Nave Titan",
        rareza: "Rara",
        precio: 300
    },

    nave12: {
        nombre: "Nave Omega",
        rareza: "Legendaria",
        precio: 1000
    },

    nave13: {
        nombre: "Nave Solar",
        rareza: "Épica",
        precio: 600
    },

    nave14: {
        nombre: "Nave Lunar",
        rareza: "Rara",
        precio: 300
    },

    nave15: {
        nombre: "Nave Void",
        rareza: "Legendaria",
        precio: 1000
    },

    nave16: {
        nombre: "Nave Neon",
        rareza: "Épica",
        precio: 600
    },

    nave17: {
        nombre: "Nave Hunter",
        rareza: "Rara",
        precio: 300
    },

    nave18: {
        nombre: "Nave Dragon",
        rareza: "Legendaria",
        precio: 1000
    },

    nave19: {
        nombre: "Nave Shadow",
        rareza: "Épica",
        precio: 600
    },

    nave20: {
        nombre: "Nave Legendaria",
        rareza: "Mítica",
        precio: 2000
    }

};


// ======================================================
// OBTENER UNA SKIN
// ======================================================

function getSkin(skinId) {

    return skins[skinId] || null;

}


// ======================================================
// OBTENER TODO EL CATÁLOGO
// ======================================================

function getAllSkins() {

    return Object.entries(skins).map(([id, skin]) => ({
        id,
        ...skin
    }));

}


// ======================================================
// COMPRAR SKIN
// ======================================================

async function purchaseSkin(playerId, skinId) {

    const skin = getSkin(skinId);

    if (!skin) {
        throw new Error("SKIN_NOT_FOUND");
    }

    if (skin.precio <= 0) {
        throw new Error("SKIN_NOT_PURCHASABLE");
    }


    // ==================================================
    // COMPROBAR SI YA LA TIENE
    // ==================================================

    const alreadyOwned = await inventory.hasSkin(
        playerId,
        skinId
    );

    if (alreadyOwned) {
        throw new Error("SKIN_ALREADY_OWNED");
    }


    // ==================================================
    // COBRAR LAS MONEDAS
    // ==================================================

    const result = await db.query(
        `
        UPDATE players
        SET coins = coins - $1
        WHERE id = $2
        AND coins >= $1
        RETURNING coins
        `,
        [
            skin.precio,
            playerId
        ]
    );


    if (result.rows.length === 0) {

        // Diferenciamos jugador inexistente
        // de saldo insuficiente.

        const player = await db.query(
            `
            SELECT id
            FROM players
            WHERE id = $1
            `,
            [playerId]
        );

        if (player.rows.length === 0) {
            throw new Error("PLAYER_NOT_FOUND");
        }

        throw new Error("INSUFFICIENT_COINS");
    }


    // ==================================================
    // REGISTRAR SKIN EN EL INVENTARIO
    // ==================================================

    try {

        await inventory.addSkin(
            playerId,
            skinId
        );

    } catch (error) {

        // IMPORTANTE:
        // Si el inventario falla después de cobrar,
        // devolvemos las monedas.

        await db.query(
            `
            UPDATE players
            SET coins = coins + $1
            WHERE id = $2
            `,
            [
                skin.precio,
                playerId
            ]
        );

        throw error;
    }


    // ==================================================
    // RESPUESTA
    // ==================================================

    return {

        skinId,
        nombre: skin.nombre,
        rareza: skin.rareza,
        precio: skin.precio,
        coins: result.rows[0].coins

    };

}


module.exports = {

    getSkin,
    getAllSkins,
    purchaseSkin

};

