// ======================================================
// LAUGH BATTLES
// DESERT20 - EVENTOS VISUALES
// ======================================================

function addEvent(room, event) {

    room.events.push({
        id: `${Date.now()}_${Math.random()}`,
        ...event
    });

}

function shoot(room, player, projectile) {

    addEvent(room, {
        type: "shoot",
        playerId: player.id,

        x: projectile.x,
        z: projectile.z,
        rotation: projectile.rotation,

        asset: projectile.asset
    });

}

function hit(room, player, projectile) {

    addEvent(room, {
        type: "hit",

        playerId: player.id,
        attackerId: projectile.owner,

        x: projectile.x,
        z: projectile.z,

        asset: "hit_default"
    });

}

function explosion(room, player) {

    addEvent(room, {
        type: "explosion",

        playerId: player.id,

        x: player.x,
        z: player.z,

        asset: "explosion_default"
    });

}

function bump(room, player, bumpId = "bump_default") {

    addEvent(room, {
        type: "bump",

        playerId: player.id,

        x: player.x,
        z: player.z,

        asset: bumpId
    });

}

function power(room, player, powerId, x, z) {

    addEvent(room, {
        type: "power",

        playerId: player.id,

        powerId,

        x,
        z,

        asset: powerId
    });

}

function death(room, player) {

    addEvent(room, {
        type: "death",

        playerId: player.id,

        x: player.x,
        z: player.z,

        asset: "explosion_default"
    });

}

function clearEvents(room) {
    room.events = [];
}

module.exports = {
    addEvent,
    shoot,
    hit,
    explosion,
    bump,
    power,
    death,
    clearEvents
};