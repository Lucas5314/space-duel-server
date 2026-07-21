// ===========================
// ACTIVAR PODER
// ===========================

function activatePower(player, power){

    switch(power){

        case "shield":

            player.powers.shield = true;
            player.powers.shieldUntil = Date.now() + 5000;

        break;

        case "invisible":

            player.powers.invisible = true;
            player.powers.invisibleUntil = Date.now() + 5000;

        break;

        case "turbo":

            player.powers.turbo = true;
            player.powers.turboUntil = Date.now() + 5000;

        break;

        case "tripleShot":

            player.powers.tripleShot = true;
            player.powers.tripleShotUntil = Date.now() + 5000;

        break;

        case "dash":

            player.powers.dash = true;
            player.powers.dashUntil = Date.now() + 300;

        break;

    }

}



// ===========================
// ACTUALIZAR PODERES
// ===========================

function updatePowers(player){

    const now = Date.now();

    if(
        player.powers.shield &&
        now > player.powers.shieldUntil
    ){
        player.powers.shield = false;
    }

    if(
        player.powers.invisible &&
        now > player.powers.invisibleUntil
    ){
        player.powers.invisible = false;
    }

    if(
        player.powers.turbo &&
        now > player.powers.turboUntil
    ){
        player.powers.turbo = false;
    }

    if(
        player.powers.tripleShot &&
        now > player.powers.tripleShotUntil
    ){
        player.powers.tripleShot = false;
    }

    if(
        player.powers.dash &&
        now > player.powers.dashUntil
    ){
        player.powers.dash = false;
    }

}

module.exports = {

    activatePower,
    updatePowers

};