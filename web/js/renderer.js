import {
    drawMap
} from "./maps.js";
//import {
  //  WORLD_WIDTH,
    //WORLD_HEIGHT
//} from "./config.js";

//import {
    canvas,
    ctx
//} from "./canvas.js";

import {
    state,
    myId
} from "./state.js";

import {
    ship,
    portalImage
} from "./assets.js";


// ================= DRAW =================

function draw(){

    ctx.clearRect(
        0,
        0,
        innerWidth,
        innerHeight
    );

   drawMap(
    ctx,
    innerWidth,
    innerHeight
);
    // ================= PORTAL =================

    if(
        state.portal &&
        state.portal.active
    ){

        const px =
            (state.portal.x / WORLD_WIDTH)
            * innerWidth;


        const py =
            (state.portal.y / WORLD_HEIGHT)
            * innerHeight;


        ctx.save();

        ctx.shadowBlur = 30;

        ctx.shadowColor = "cyan";


        ctx.drawImage(

            portalImage,

            px - 60,
            py - 60,

            120,
            120

        );


        ctx.restore();

    }


    // ================= PLAYERS =================

    const shipSize =
        Math.min(
            innerWidth * 0.16,
            110
        );


    for(const p of state.players){

        const isMe =
            p.id === myId;


        const x =
            (p.x / WORLD_WIDTH)
            * innerWidth;


        const y =
            isMe
                ? innerHeight - 130
                : 130;


        ctx.save();

        ctx.shadowBlur = 20;

        ctx.shadowColor =
            isMe
                ? "cyan"
                : "orange";


        if(!p.invisible){

            ctx.save();

            ctx.translate(
                x,
                y
            );


            // El rival mira hacia abajo

            if(!isMe){

                ctx.rotate(
                    Math.PI
                );

            }


            ctx.drawImage(

                ship,

                -shipSize / 2,
                -shipSize / 2,

                shipSize,
                shipSize

            );


            ctx.restore();

        }


        ctx.restore();


        // ================= VIDA =================

        ctx.fillStyle = "lime";


        ctx.fillRect(

            x - shipSize / 2,

            y - shipSize / 2 - 16,

            p.hp * (shipSize / 4),

            8

        );

    }


    // ================= SIGUIENTE FRAME =================

    requestAnimationFrame(draw);

}


draw();