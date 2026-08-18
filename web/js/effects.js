import {
    WORLD_WIDTH,
    WORLD_HEIGHT
} from "./config.js";


// ================= FX =================

export function createHitEffect(x, y) {

    const gif = document.createElement("img");

    const effects = [
        "assets/effects/particle1.gif",
        "assets/effects/particle2.gif",
        "assets/effects/particle3.gif"
    ];

    gif.src =
        effects[
            Math.floor(Math.random() * effects.length)
        ];

    gif.style.position = "fixed";

    gif.style.width = "90px";
    gif.style.height = "90px";

    gif.style.left =
        ((x / WORLD_WIDTH) * innerWidth - 45) + "px";

    gif.style.top =
        ((y / WORLD_HEIGHT) * innerHeight - 45) + "px";

    gif.style.pointerEvents = "none";

    gif.style.zIndex = "50";

    document.body.appendChild(gif);

    setTimeout(() => {

        gif.remove();

    }, 600);
}