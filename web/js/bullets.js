import {
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./config.js";

import {
    bulletImage
} from "./assets.js";


export function drawBullets(ctx, projectiles) {

    for (const b of projectiles) {

        const x =
            (b.x / WORLD_WIDTH) * innerWidth;

        const y =
            (b.y / WORLD_HEIGHT) * innerHeight;


        ctx.save();

        ctx.shadowBlur = 20;
        ctx.shadowColor = "cyan";


        ctx.drawImage(
            bulletImage,
            x - 10,
            y - 24,
            20,
            48
        );


        ctx.restore();

    }
}