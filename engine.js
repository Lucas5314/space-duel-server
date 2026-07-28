console.log("ENGINE CARGADO");
const block01 = new Block({

    road:"engine/roads/road_01.png",

    left:"engine/bloques/paredes/left.png",

    right:"engine/bloques/paredes/right.png"

});


function loop(){
    console.log("LOOP FUNCIONANDO");


    Renderer.clear();
    console.log("dibujando bloque");


    block01.draw();


    requestAnimationFrame(loop);

}


loop();