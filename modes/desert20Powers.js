// ======================================================
// LAUGH BATTLES
// DESERT20 - PODERES
// ======================================================

const POWER_COOLDOWN = 10000;

const powers = {

    dash: {
        id: "dash",
        duration: 800
    },

    shield: {
        id: "shield",
        duration: 3000
    },

    turbo: {
        id: "turbo",
        duration: 5000
    },

    explosion: {
        id: "explosion",
        radius: 150,
        damage: 50
    },

    invisibility: {
        id: "invisibility",
        duration: 4000
    },

    heal: {
        id: "heal",
        amount: 30
    },

    cannon: {
        id: "cannon",
        damage: 80,
        radius: 100
    },

    freeze: {
        id: "freeze",
        duration: 3000
    },

    teleport: {
        distance: 300
    },

    meteor: {
        damage: 100,
        radius: 200
    }

};

function canUsePower(player) {

    if (!player || !player.alive) {
        return false;
    }

    const now = Date.now();

    if (now < player.powerReadyAt) {
        return false;
    }

    return true;
}

function activatePower(player, powerId) {

    if (!canUsePower(player)) {
        return null;
    }

    const power = powers[powerId];

    if (!power) {
        return null;
    }

    player.powerReadyAt = Date.now() + POWER_COOLDOWN;

    return {
        id: power.id,
        config: power
    };
}

function getPower(powerId) {
    return powers[powerId] || null;
}

module.exports = {
    powers,
    canUsePower,
    activatePower,
    getPower
};