// ======================================================
// LAUGH BATTLES
// MODO DESERT20
// ======================================================
//
// 20 jugadores
// Movimiento: adelante / atrás / izquierda / derecha
// Disparo
// Servidor autoritativo
//
// Este archivo NO administra WebSocket.
// Este archivo contiene la lógica del modo.
// ======================================================

const {
    getShip
} = require("./desert20Ships");

const desert20Events =
    require("./desert20Events");
const MAX_PLAYERS = 20;


// ======================================================
// MAPA
// ======================================================

const MAP_WIDTH = 1800;
const MAP_DEPTH = 1800;


// ======================================================
// MOVIMIENTO
// ======================================================

const PLAYER_SPEED = 8;


// ======================================================
// VIDA
// ======================================================

const MAX_HP = 100;


// ======================================================
// DISPAROS
// ======================================================

const BULLET_SPEED = 25;
const FIRE_COOLDOWN = 250;
const BULLET_DAMAGE = 25;

// ======================================================
// CREAR JUGADOR
// ======================================================

function createPlayer(player, index){

    const spawn = getSpawnPosition(index);

    // ==========================================
    // NAVE ELEGIDA
    // ==========================================

    const shipId =
        player.shipId || "nave1";

    const ship =
        getShip(shipId);


    return {

        id: player.id,

        username: player.username,

        isBot: !!player.isBot,


        // ==========================================
        // NAVE
        // ==========================================

        shipId: ship.id,

        ship: ship.name,


        // ==========================================
        // ESTADÍSTICAS DE LA NAVE
        // ==========================================

        speed:
            ship.stats.speed,

        damage:
            ship.stats.damage,

        fireCooldown:
            ship.stats.fireCooldown,


        // ==========================================
        // PODER
        // ==========================================

        powerId:
            ship.power,

        powerReadyAt: 0,


        // ==========================================
        // POSICIÓN
        // ==========================================

        x: spawn.x,

        z: spawn.z,

        rotation: spawn.rotation,


        // ==========================================
        // VIDA
        // ==========================================

        hp:
            ship.stats.hp,

        maxHp:
            ship.stats.hp,

        alive: true,


        // ==========================================
        // INPUT
        // ==========================================

        input: {

            forward: false,

            backward: false,

            left: false,

            right: false,

            fire: false,

            power: false

        },


        // ==========================================
        // DISPARO
        // ==========================================

        lastShot: 0

    };

}

// ======================================================
// POSICIONES DE SPAWN
// ======================================================

function getSpawnPosition(index){

    const total = MAX_PLAYERS;

    const radius = 650;

    const angle =
        (Math.PI * 2 / total) * index;


    return {

        x: Math.cos(angle) * radius,

        z: Math.sin(angle) * radius,

        rotation: angle + Math.PI

    };

}


// ======================================================
// INICIALIZAR SALA
// ======================================================

function initializeRoom(room, players){

    room.mode = "desert20";

    room.world = "western";

    room.maxPlayers = MAX_PLAYERS;


    room.players = players.map(
        (player, index) =>
            createPlayer(player, index)
    );


    room.projectiles = [];

    room.events = [];


    // ==========================================
    // SOCKETS
    // ==========================================

    room.sockets = {};

    for(const player of players){

        room.sockets[player.id] = player;

        player.room = room.id;

    }


    return room;

}


// ======================================================
// ACTUALIZAR INPUT
// ======================================================

function updateInput(player, input){

    if(!player || !player.alive){

        return;

    }


    if(typeof input.forward === "boolean"){

        player.input.forward =
            input.forward;

    }


    if(typeof input.backward === "boolean"){

        player.input.backward =
            input.backward;

    }


    if(typeof input.left === "boolean"){

        player.input.left =
            input.left;

    }


    if(typeof input.right === "boolean"){

        player.input.right =
            input.right;

    }


    if(typeof input.fire === "boolean"){

        player.input.fire =
            input.fire;

    }

}


// ======================================================
// ACTUALIZAR JUGADOR
// ======================================================

function updatePlayer(player){

    if(!player.alive){

        return;

    }


    let moveX = 0;

    let moveZ = 0;


    // ==========================================
    // ADELANTE / ATRÁS
    // ==========================================

    if(player.input.forward){

        moveX += Math.sin(
            player.rotation
        );

        moveZ += Math.cos(
            player.rotation
        );

    }


    if(player.input.backward){

        moveX -= Math.sin(
            player.rotation
        );

        moveZ -= Math.cos(
            player.rotation
        );

    }


    // ==========================================
    // IZQUIERDA / DERECHA
    // ==========================================

    if(player.input.left){

        player.rotation -= 0.08;

    }


    if(player.input.right){

        player.rotation += 0.08;

    }


    // ==========================================
    // NORMALIZAR MOVIMIENTO
    // ==========================================

    const length =
        Math.sqrt(
            moveX * moveX +
            moveZ * moveZ
        );


    if(length > 0){

        moveX =
            moveX / length;

        moveZ =
            moveZ / length;

player.x +=
    moveX * player.speed;

player.z +=
    moveZ * player.speed;

    }


    // ==========================================
    // LIMITES DEL MAPA
    // ==========================================

    const halfWidth =
        MAP_WIDTH / 2;

    const halfDepth =
        MAP_DEPTH / 2;


    player.x = Math.max(
        -halfWidth,
        Math.min(
            halfWidth,
            player.x
        )
    );


    player.z = Math.max(
        -halfDepth,
        Math.min(
            halfDepth,
            player.z
        )
    );

}


// ======================================================
// CREAR PROYECTIL
// ======================================================

function createProjectile(player){

    const now = Date.now();


    if(
        !player.alive ||
        !player.input.fire
    ){

        return null;

    }


    if(
        now - player.lastShot <
        player.fireCooldown
    ){

        return null;

    }


    player.lastShot = now;


    const ship =
        getShip(player.shipId);


    return {

        id:
            `${player.id}_${now}_${Math.random()}`,

        owner:
            player.id,


        // ==========================================
        // POSICIÓN
        // ==========================================

        x:
            player.x,

        z:
            player.z,


        // ==========================================
        // DIRECCIÓN
        // ==========================================

        rotation:
            player.rotation,


        // ==========================================
        // CARACTERÍSTICAS
        // ==========================================

        speed:
            BULLET_SPEED,

        damage:
            player.damage,


        // ==========================================
        // ASSET DEL PROYECTIL
        // ==========================================

        asset:
            ship.assets.projectile

    };

}

// ======================================================
// ACTUALIZAR PROYECTIL
// ======================================================

function updateProjectile(projectile){

    projectile.x +=
        Math.sin(
            projectile.rotation
        ) *
        projectile.speed;


    projectile.z +=
        Math.cos(
            projectile.rotation
        ) *
        projectile.speed;

}


// ======================================================
// COMPROBAR SI EL PROYECTIL SALIÓ DEL MAPA
// ======================================================

function projectileOutsideMap(projectile){

    const halfWidth =
        MAP_WIDTH / 2;


    const halfDepth =
        MAP_DEPTH / 2;


    return (

        projectile.x < -halfWidth ||

        projectile.x > halfWidth ||

        projectile.z < -halfDepth ||

        projectile.z > halfDepth

    );

}


// ======================================================
// COLISIÓN PROYECTIL → JUGADOR
// ======================================================

function checkProjectileHit(
    projectile,
    player
){

    if(!player.alive){

        return false;

    }


    if(player.id === projectile.owner){

        return false;

    }


    const dx =
        projectile.x - player.x;


    const dz =
        projectile.z - player.z;


    const distance =
        Math.sqrt(
            dx * dx +
            dz * dz
        );


    return distance < 35;

}


// ======================================================
// APLICAR DAÑO
// ======================================================

function damagePlayer(
    player,
    damage
){

    if(!player.alive){

        return false;

    }


    player.hp -= damage;


    if(player.hp <= 0){

        player.hp = 0;

        player.alive = false;

        return true;

    }


    return false;

}


// ======================================================
// ACTUALIZAR SALA
// ======================================================

function updateRoom(room){

    if(!room || !room.started){

        return;

    }


    // ==========================================
    // JUGADORES
    // ==========================================

    for(const player of room.players){

        updatePlayer(player);


        const projectile =
            createProjectile(player);


        if(projectile){

            room.projectiles.push(
                projectile
            );

        }

    }


    // ==========================================
    // PROYECTILES
    // ==========================================

    for(
        let i =
            room.projectiles.length - 1;

        i >= 0;

        i--

    ){

        const projectile =
            room.projectiles[i];


        updateProjectile(
            projectile
        );


        // ======================================
        // FUERA DEL MAPA
        // ======================================

        if(
            projectileOutsideMap(
                projectile
            )
        ){

            room.projectiles.splice(
                i,
                1
            );

            continue;

        }


        // ======================================
        // COLISIONES
        // ======================================

        let hit = false;


        for(
            const player
            of room.players
        ){

            if(
                checkProjectileHit(
                    projectile,
                    player
                )
            ){

                const killed =
                    damagePlayer(
                        player,
                        projectile.damage
                    );


                room.events.push({

                    type:
                        killed
                        ? "death"
                        : "hit",

                    playerId:
                        player.id,

                    attackerId:
                        projectile.owner,

                    x:
                        projectile.x,

                    z:
                        projectile.z

                });


                hit = true;

                break;

            }

        }


        if(hit){

            room.projectiles.splice(
                i,
                1
            );

        }

    }

}


// ======================================================
// ESTADO QUE ENVIAREMOS AL CLIENTE
// ======================================================

function getState(room){

    return {

        type:"state",

        mode:"desert20",

        world:room.world,


        players:
            room.players.map(
                player => ({

                    id:
                        player.id,

                    username:
                        player.username,

                    x:
                        player.x,

                    z:
                        player.z,

                    rotation:
                        player.rotation,

                    hp:
                        player.hp,

                    maxHp:
                        player.maxHp,

                    alive:
                        player.alive

                })
            ),


        projectiles:
            room.projectiles.map(
                projectile => ({

                    id:
                        projectile.id,

                    owner:
                        projectile.owner,

                    x:
                        projectile.x,

                    z:
                        projectile.z,

                    rotation:
                        projectile.rotation

                })
            ),


        events:
            room.events

    };

}


// ======================================================
// LIMPIAR EVENTOS
// ======================================================

function clearEvents(room){

    room.events = [];

}


// ======================================================
// EXPORTAR
// ======================================================

module.exports = {

    MAX_PLAYERS,

    initializeRoom,

    updateInput,

    updateRoom,

    getState,

    clearEvents

};
