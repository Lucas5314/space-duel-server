export const canvas = document.getElementById("c");

export const ctx = canvas.getContext("2d");

function resize(){

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width =
        innerWidth * dpr;

    canvas.height =
        innerHeight * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}

resize();

window.addEventListener(
    "resize",
    resize
);