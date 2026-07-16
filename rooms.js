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


    const room = {

        id:roomId,

        started:false,

        players:[

            {
                id:a.id,
                side:"bottom",
                hp:40,
                x:450,
                left:false,
                right:false,
                fire:false,
                lastShot:0,
                isBot:a.isBot,
                invisible:false,
                invisibleUntil:0
            },

            {
                id:b.id,
                side:"top",
                hp:40,
                x:450,
                left:false,
                right:false,
                fire:false,
                lastShot:0,
                isBot:b.isBot,
                invisible:false,
                invisibleUntil:0
            }

        ],


        projectiles:[],


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