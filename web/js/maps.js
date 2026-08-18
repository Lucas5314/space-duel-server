// ================= MAP CONFIG =================

const mapConfig = {

    width: 900,
    height: 820,

    floor: "assets/maps/callejon/floor.png",

    objects: [

        "assets/maps/callejon/objeto1.png",
        "assets/maps/callejon/objeto2.png",
        "assets/maps/callejon/objeto3.png",
        "assets/maps/callejon/objeto4.png",
        "assets/maps/callejon/objeto5.png"

    ],

    speed: 2,

    loop: true

};


// ================= MAP FLOOR =================

const mapFloor = new Image();

mapFloor.src = mapConfig.floor;


// ================= MAP OBJECTS =================

const mapObjects = [];


// ================= DISTANCIA MINIMA =================

// Distancia mínima entre objetos
const MIN_DISTANCE = 100;


// ================= RANDOM OBJECTS =================

function createMapObjects(){

    mapObjects.length = 0;


    for(const src of mapConfig.objects){

        const image = new Image();

        image.src = src;


        let x;
        let y;

        let validPosition = false;


        // ==========================================
        // BUSCAR UNA POSICIÓN LIBRE
        // ==========================================

        while(!validPosition){

            x =
                60 +
                Math.random() *
                (mapConfig.width - 120);


            y =
                60 +
                Math.random() *
                (mapConfig.height - 120);


            validPosition = true;


            // Comprobar distancia con
            // los objetos anteriores

            for(const other of mapObjects){

                const dx =
                    x - other.x;


                const dy =
                    y - other.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if(
                    distance <
                    MIN_DISTANCE
                ){

                    validPosition = false;

                    break;

                }

            }

        }


        // ==========================================
        // CREAR OBJETO
        // ==========================================

        const object = {

            image: image,

            x: x,

            y: y,

            size:
                40 +
                Math.random() * 40

        };


        mapObjects.push(object);

    }

}


// ==================================================
// PRIMERA GENERACIÓN
// ==================================================

createMapObjects();


// ================= MAP MOVEMENT =================

let mapOffset = 0;


// ==================================================
// DRAW MAP
// ==================================================

function drawMap(
    ctx,
    canvasWidth,
    canvasHeight
){

    if(
        !mapFloor.complete ||
        !mapFloor.naturalWidth
    ){

        return;

    }


    // ================= SCALE =================

    const scaleX =
        canvasWidth /
        mapConfig.width;


    const scaleY =
        canvasHeight /
        mapConfig.height;


    const scale =
        Math.max(
            scaleX,
            scaleY
        );


    const width =
        mapConfig.width *
        scale;


    const height =
        mapConfig.height *
        scale;


    // ================= MOVEMENT =================

    mapOffset +=
        mapConfig.speed;


    // ==================================================
    // NUEVO LOOP
    // ==================================================

    if(
        mapOffset >= height
    ){

        /*
            Conservamos cualquier pequeño
            excedente del movimiento.

            Esto evita pequeños saltos.
        */

        mapOffset -= height;


        /*
            IMPORTANTE:

            Los objetos SOLO cambian
            aquí, cuando empieza
            el siguiente loop.
        */

        createMapObjects();

    }


    // ================= FLOOR =================

    const y1 =
        mapOffset -
        height;


    const y2 =
        mapOffset;


    // ==================================================
    // PRIMERA COPIA DEL PISO
    // ==================================================

    ctx.drawImage(

        mapFloor,

        0,
        y1,

        width,
        height

    );


    // ==================================================
    // SEGUNDA COPIA DEL PISO
    // ==================================================

    ctx.drawImage(

        mapFloor,

        0,
        y2,

        width,
        height

    );


    // ================= OBJECTS =================

    drawObjects(
        ctx,
        scale,
        mapOffset,
        height
    );

}


// ==================================================
// DRAW OBJECTS
// ==================================================

function drawObjects(
    ctx,
    scale,
    offset,
    height
){

    for(
        const object
        of mapObjects
    ){

        if(
            !object.image.complete ||
            !object.image.naturalWidth
        ){

            continue;

        }


        // ================= POSITION =================

        const x =
            object.x *
            scale;


        const size =
            object.size *
            scale;


        // ==================================================
        // PRIMERA COPIA
        // ==================================================

        const y1 =
            object.y *
            scale +
            offset -
            height;


        ctx.drawImage(

            object.image,

            x -
                size / 2,

            y1 -
                size / 2,

            size,
            size

        );


        // ==================================================
        // SEGUNDA COPIA
        // ==================================================

        const y2 =
            object.y *
            scale +
            offset;


        ctx.drawImage(

            object.image,

            x -
                size / 2,

            y2 -
                size / 2,

            size,
            size

        );

    }

}


// ================= EXPORT =================

export {

    drawMap

};