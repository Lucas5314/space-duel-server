// ================================
// GOOGLE PLAY - COMPRAS DE MONEDAS
// ================================

const COIN_PACKS = {

    "603": {
        coins: 600
    },

    coins_1200: {
        coins: 1200
    }

};


// ================================
// OBTENER PAQUETE
// ================================

function getCoinPack(productId){

    return COIN_PACKS[productId] || null;

}


// ================================
// VALIDAR PRODUCTO
// ================================

function isValidProduct(productId){

    return Boolean(
        COIN_PACKS[productId]
    );

}


module.exports = {

    COIN_PACKS,
    getCoinPack,
    isValidProduct

};