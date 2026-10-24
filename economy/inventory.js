const db = require("../database/db");

// ======================================================
// INVENTARIO DE SKINS
// ======================================================
//
// Este módulo será el puente entre el servidor y la DB.
// Isabela conectará las tablas definitivas.
//
// Contrato esperado:
//
// jugador
//   ↓
// inventario de skins
//   ↓
// skinId
//
// ======================================================


// ======================================================
// OBTENER SKINS DEL JUGADOR
// ======================================================

async function getPlayerSkins(playerId) {

    const result = await db.query(
        `
        SELECT skin_id
        FROM player_skins
        WHERE player_id = $1
        ORDER BY skin_id
        `,
        [playerId]
    );

    return result.rows.map(row => row.skin_id);
}


// ======================================================
// COMPROBAR SI EL JUGADOR TIENE UNA SKIN
// ======================================================

async function hasSkin(playerId, skinId) {

    const result = await db.query(
        `
        SELECT 1
        FROM player_skins
        WHERE player_id = $1
        AND skin_id = $2
        LIMIT 1
        `,
        [playerId, skinId]
    );

    return result.rows.length > 0;
}


// ======================================================
// AÑADIR SKIN AL INVENTARIO
// ======================================================

async function addSkin(playerId, skinId) {

    const result = await db.query(
        `
        INSERT INTO player_skins (player_id, skin_id)
        VALUES ($1, $2)
        ON CONFLICT (player_id, skin_id)
        DO NOTHING
        RETURNING skin_id
        `,
        [playerId, skinId]
    );

    return result.rows.length > 0;
}


// ======================================================
// EQUIPAR SKIN
// ======================================================

async function equipSkin(playerId, skinId) {

    // Primero comprobamos que realmente la posee
    const ownsSkin = await hasSkin(playerId, skinId);

    if (!ownsSkin) {
        throw new Error("SKIN_NOT_OWNED");
    }

    const result = await db.query(
        `
        UPDATE players
        SET skin = $1
        WHERE id = $2
        RETURNING skin
        `,
        [skinId, playerId]
    );

    if (result.rows.length === 0) {
        throw new Error("PLAYER_NOT_FOUND");
    }

    return result.rows[0].skin;
}


// ======================================================
// OBTENER SKIN EQUIPADA
// ======================================================

async function getEquippedSkin(playerId) {

    const result = await db.query(
        `
        SELECT skin
        FROM players
        WHERE id = $1
        `,
        [playerId]
    );

    if (result.rows.length === 0) {
        throw new Error("PLAYER_NOT_FOUND");
    }

    return result.rows[0].skin;
}


module.exports = {
    getPlayerSkins,
    hasSkin,
    addSkin,
    equipSkin,
    getEquippedSkin
};

