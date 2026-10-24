// ======================================================
// LAUGH BATTLES
// MODO 3 — WATER BATTLE
// ======================================================
// Batalla de naves acuáticas
//
// Movimiento 3D:
//
// X = izquierda / derecha
// Y = profundidad
// Z = adelante / atrás
//
// La nave puede:
// - avanzar
// - retroceder
// - moverse lateralmente
// - sumergirse
// - subir a la superficie
// - disparar
// ======================================================


const MAX_PLAYERS = 20;


// ======================================================
// MAPA
// ======================================================

const MAP_WIDTH = 2400;
const MAP_DEPTH = 2400;

const SURFACE_Y = 0;
const MAX_DEPTH = -800;


// ======================================================
// MOVIMIENTO
// ======================================================

const MOVE_SPEED = 9;

const DIVE_SPEED = 5;
const SURFACE_SPEED = 5;


// ======================================================
// COMBATE
// ======================================================

const MAX_HP = 100;

const BULLET_SPEED = 30;

const BULLET_DAMAGE = 25;

const FIRE_COOLDOWN = 300;


// ======================================================
// CREAR JUGADOR
// ======================================================

function createPlayer(player, index){

    const spawn = getSpawnPosition(index);

    return {

        id: player.id,

        username: player.username,

        isBot: !!player.isBot,


        // Posición 3D

        x: spawn.x,

        y: SURFACE_Y,

        z: spawn.z,


        // Dirección

        rotation: spawn.rotation,


        // Movimiento

        velocity: {
            x: 0,
            y: 0,
            z: 0
        },


        // Combate

        hp: MAX_HP,

        maxHp: MAX_HP,

        alive: true,


        // Estado del agua

        submerged: false,


        // Input

        input: {

            forward: false,

            backward: false,

            left: false,

            right: false,

            dive: false,

            surface: false,

            fire: false

        },


        lastShot: 0

    };

}


// ======================================================
// POSICIONES INICIALES
// ======================================================

function getSpawnPosition(index){

    const total = MAX_PLAYERS;

    const radius = 900;

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

    room.mode = "waterbattle";

    room.world = "water";

    room.maxPlayers = MAX_PLAYERS;


    room.players = players.map(
        (player, index) =>
            createPlayer(player, index)
    );


    room.projectiles = [];

    room.events = [];


    room.sockets = {};


    for(const player of players){

        room.sockets[player.id] = player;

        player.room = room.id;

    }


    return room;

}


// ======================================================
// INPUT
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


    if(typeof input.dive === "boolean"){

        player.input.dive =
            input.dive;

    }


    if(typeof input.surface === "boolean"){

        player.input.surface =
            input.surface;

    }


    if(typeof input.fire === "boolean"){

        player.input.fire =
            input.fire;

    }

}


// ======================================================
// MOVIMIENTO
// ======================================================

function updatePlayer(player){

    if(!player.alive){

        return;

    }


    let moveX = 0;

    let moveZ = 0;


    // ----------------------------------------------
    // ADELANTE
    // ----------------------------------------------

    if(player.input.forward){

        moveX += Math.sin(
            player.rotation
        );

        moveZ += Math.cos(
            player.rotation
        );

    }


    // ----------------------------------------------
    // ATRÁS
    // ----------------------------------------------

    if(player.input.backward){

        moveX -= Math.sin(
            player.rotation
        );

        moveZ -= Math.cos(
            player.rotation
        );

    }


    // ----------------------------------------------
    // IZQUIERDA
    // ----------------------------------------------

    if(player.input.left){

        moveX += Math.cos(
            player.rotation
        );

        moveZ -= Math.sin(
            player.rotation
        );

    }


    // ----------------------------------------------
    // DERECHA
    // ----------------------------------------------

    if(player.input.right){

        moveX -= Math.cos(
            player.rotation
        );

        moveZ += Math.sin(
            player.rotation
        );

    }


    // ----------------------------------------------
    // NORMALIZAR MOVIMIENTO
    // ----------------------------------------------

    const length =
        Math.sqrt(
            moveX * moveX +
            moveZ * moveZ
        );


    if(length > 0){

        moveX /= length;

        moveZ /= length;


        player.x +=
            moveX * MOVE_SPEED;


        player.z +=
            moveZ * MOVE_SPEED;

    }


    // =================================================
    // PROFUNDIDAD
    // =================================================


    // SUMERGIR

    if(player.input.dive){

        player.y -= DIVE_SPEED;

    }


    // SUBIR

    if(player.input.surface){

        player.y += SURFACE_SPEED;

    }


    // =================================================
    // LIMITES DEL MAPA
    // =================================================

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


    // =================================================
    // LIMITE DE PROFUNDIDAD
    // =================================================

    player.y = Math.max(
        MAX_DEPTH,
        Math.min(
            SURFACE_Y,
            player.y
        )
    );


    // =================================================
    // ESTADO SUMERGIDO
    // =================================================

    player.submerged =
        player.y < -20;

}


// ======================================================
// CREAR PROYECTIL
// ======================================================

function createProjectile(player){

    const now = Date.now();


    if(!player.alive){

        return null;

    }


    if(!player.input.fire){

        return null;

    }


    if(
        now - player.lastShot
        < FIRE_COOLDOWN
    ){

        return null;

    }


    player.lastShot = now;


    return {

        id:
            `${player.id}_${now}_${Math.random()}`,

        owner:
            player.id,


        x:
            player.x,

        y:
            player.y,

        z:
            player.z,


        rotation:
            player.rotation,


        speed:
            BULLET_SPEED,


        damage:
            BULLET_DAMAGE

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
// PROYECTIL FUERA DEL MAPA
// ======================================================

function projectileOutsideMap(projectile){

    const halfWidth =
        MAP_WIDTH / 2;

    const halfDepth =
        MAP_DEPTH / 2;


    return (

        projectile.x <
        -halfWidth

        ||

        projectile.x >
        halfWidth

        ||

        projectile.z <
        -halfDepth

        ||

        projectile.z >
        halfDepth

        ||

        projectile.y <
        MAX_DEPTH

        ||

        projectile.y >
        SURFACE_Y

    );

}


// ======================================================
// COLISIÓN
// ======================================================

function checkProjectileHit(
    projectile,
    player
){

    if(!player.alive){

        return false;

    }


    if(
        player.id ===
        projectile.owner
    ){

        return false;

    }


    const dx =
        projectile.x -
        player.x;


    const dy =
        projectile.y -
        player.y;


    const dz =
        projectile.z -
        player.z;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy +
            dz * dz
        );


    return distance < 45;

}


// ======================================================
// DAÑO
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

    if(
        !room ||
        !room.started
    ){

        return;

    }


    // ----------------------------------------------
    // JUGADORES
    // ----------------------------------------------

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


    // ----------------------------------------------
    // PROYECTILES
    // ----------------------------------------------

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


        let hit = false;


        // ------------------------------------------
        // COLISIONES
        // ------------------------------------------

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

                    y:
                        projectile.y,

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
// ESTADO PARA CLIENTE
// ======================================================

function getState(room){

    return {

        type: "state",

        mode: "waterbattle",

        world: room.world,


        players:
            room.players.map(
                player => ({

                    id:
                        player.id,

                    username:
                        player.username,


                    x:
                        player.x,

                    y:
                        player.y,

                    z:
                        player.z,


                    rotation:
                        player.rotation,


                    hp:
                        player.hp,

                    maxHp:
                        player.maxHp,


                    alive:
                        player.alive,


                    submerged:
                        player.submerged

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

                    y:
                        projectile.y,

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