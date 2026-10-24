// ================================
// GOOGLE PLAY - COMPRAS DE MONEDAS
// ================================

const COIN_PACKS = {

    coins_300: {
        coins: 300
    },

    coins_600: {
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