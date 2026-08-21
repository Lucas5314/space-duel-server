const crypto = require("crypto");


// ===========================
// TODAS LAS SALAS ACTIVAS
// ===========================

const rooms = {};



// ===========================
// CREAR SALA
// ===========================

function createRoom(a,b){

    const roomId =
    crypto.randomUUID();

    console.log("🔥🔥 ROOM CREADA");
console.log("ROOM:", roomId);
console.log("ROOM PLAYERS:", room.players);
console.log("SOCKETS:", Object.keys(room.sockets));


    const room = {

        id:roomId,

        started:false,

        players:[

            {
                id:a.id,
                username: a.username,
                side:"bottom",
                hp:40,
                x:450,
                left:false,
                right:false,
                fire:false,
                lastShot:0,
                isBot:a.isBot,
                // ===========================
// PODERES
// ===========================

powers:{

    // defensa
    shield:false,
    shieldUntil:0,

    // invisibilidad
    invisible:false,
    invisibleUntil:0,

    // movimiento
    turbo:false,
    turboUntil:0,

    // control enemigo
    frozenUntil:0,

    // ataque
    tripleShot:false,
    tripleShotUntil:0,

    // portal
    portalReady:true,

    // esquivar / dash
    dash:false,
    dashUntil:0

}
            },

            {
                id:b.id,
                username: b.username,
                side:"top",
                hp:40,
                x:450,
                left:false,
                right:false,
                fire:false,
                lastShot:0,
                isBot:b.isBot,
                powers:{
                    // defensa
                    shield:false,
                    shieldUntil:0,

                    // invisibilidad
                    invisible:false,
                    invisibleUntil:0,

                    // movimiento
                    turbo:false,
                    turboUntil:0,

                    // control enemigo
                    frozenUntil:0,

                    // ataque
                    tripleShot:false,
                    tripleShotUntil:0,

                    // portal
                    portalReady:true,

                    // esquivar / dash
                    dash:false,
                    dashUntil:0
                }
            }

        ],


        projectiles:[],

        // ===========================
// EVENTOS DEL MAPA
// ===========================

        events:[],


        // ===========================
        // PORTAL
        // ===========================

        portal:{

            x:450,

            y:410,

            active:true

        },


        sockets:{

            [a.id]:a,

            [b.id]:b

        }

    };


    rooms[roomId]=room;


    a.room=roomId;
    b.room=roomId;


    return room;

}



// ===========================
// ELIMINAR SALA
// ===========================

function removeRoom(roomId){

    delete rooms[roomId];

}




module.exports={

    rooms,

    createRoom,

    removeRoom

};