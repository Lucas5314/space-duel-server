// ======================================================
// LAUGH BATTLES
// DESERT20 - NAVES
// ======================================================

const desert20Ships = {

    nave1: {
        id: "nave1",
        name: "Nave Azul",

        stats: {
            hp: 100,
            speed: 8,
            damage: 25,
            fireCooldown: 300
        },

        power: "dash",

        assets: {
            ship: "assets/ships/nave1.png",
            projectile: "assets/desert20/powers/dash_projectile.png"
        }
    },

    nave2: {
        id: "nave2",
        name: "Nave Roja",

        stats: {
            hp: 120,
            speed: 7,
            damage: 30,
            fireCooldown: 350
        },

        power: "shield",

        assets: {
            ship: "assets/ships/nave2.png",
            projectile: "assets/desert20/powers/shield_projectile.png"
        }
    },

    nave3: {
        id: "nave3",
        name: "Nave Dorada",

        stats: {
            hp: 90,
            speed: 11,
            damage: 20,
            fireCooldown: 220
        },

        power: "turbo",

        assets: {
            ship: "assets/ships/nave3.png",
            projectile: "assets/desert20/powers/turbo_projectile.png"
        }
    },

    nave4: {
        id: "nave4",
        name: "Nave Pesada",

        stats: {
            hp: 160,
            speed: 5,
            damage: 40,
            fireCooldown: 450
        },

        power: "explosion",

        assets: {
            ship: "assets/ships/nave4.png",
            projectile: "assets/desert20/powers/explosion_projectile.png"
        }
    },

    nave5: {
        id: "nave5",
        name: "Nave Fantasma",

        stats: {
            hp: 80,
            speed: 10,
            damage: 25,
            fireCooldown: 280
        },

        power: "invisibility",

        assets: {
            ship: "assets/ships/nave5.png",
            projectile: "assets/desert20/powers/ghost_projectile.png"
        }
    },

    nave6: {
        id: "nave6",
        name: "Nave Médica",

        stats: {
            hp: 110,
            speed: 7,
            damage: 18,
            fireCooldown: 300
        },

        power: "heal",

        assets: {
            ship: "assets/ships/nave6.png",
            projectile: "assets/desert20/powers/heal_projectile.png"
        }
    },

    nave7: {
        id: "nave7",
        name: "Nave Cañón",

        stats: {
            hp: 130,
            speed: 6,
            damage: 50,
            fireCooldown: 600
        },

        power: "cannon",

        assets: {
            ship: "assets/ships/nave7.png",
            projectile: "assets/desert20/powers/cannon_projectile.png"
        }
    },

    nave8: {
        id: "nave8",
        name: "Nave Congelante",

        stats: {
            hp: 100,
            speed: 8,
            damage: 22,
            fireCooldown: 320
        },

        power: "freeze",

        assets: {
            ship: "assets/ships/nave8.png",
            projectile: "assets/desert20/powers/ice_projectile.png"
        }
    },

    nave9: {
        id: "nave9",
        name: "Nave Teletransportadora",

        stats: {
            hp: 90,
            speed: 9,
            damage: 24,
            fireCooldown: 280
        },

        power: "teleport",

        assets: {
            ship: "assets/ships/nave9.png",
            projectile: "assets/desert20/powers/teleport_projectile.png"
        }
    },

    nave10: {
        id: "nave10",
        name: "Nave Mítica",

        stats: {
            hp: 140,
            speed: 9,
            damage: 35,
            fireCooldown: 300
        },

        power: "meteor",

        assets: {
            ship: "assets/ships/nave10.png",
            projectile: "assets/desert20/powers/meteor_projectile.png"
        }
    }

};

function getShip(shipId) {
    return desert20Ships[shipId] || desert20Ships.nave1;
}

module.exports = {
    desert20Ships,
    getShip
};