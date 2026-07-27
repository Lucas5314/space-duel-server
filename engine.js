function loop(){


Renderer.clear();



Renderer.rect(
    100,
    100,
    200,
    200,
    "gray"
);



requestAnimationFrame(loop);

}



loop();