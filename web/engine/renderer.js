const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");


canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;



const Renderer = {


clear(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

},


rect(x,y,w,h,color){

    ctx.fillStyle=color;

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

}


};