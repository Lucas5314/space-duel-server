// =========================
// TOUCH CONTROL
// =========================

export function initTouch(ws, joystick, WORLD_WIDTH){

    let touchActive = false;
    let joystickActive = false;
    let lastTap = 0;


    // =========================
    // TOUCH START
    // =========================

    addEventListener("touchstart", (e)=>{

        // No interferir con botones
        if(
            e.target.id === "shoot" ||
            e.target.id === "invisible"
        ){
            return;
        }

        e.preventDefault();

        const touch = e.touches[0];
        const now = Date.now();


        // DOBLE TOQUE
        // ACTIVAR JOYSTICK DE DISPARO

        if(now - lastTap < 300){

            joystickActive = true;

            joystick.style.display = "block";

            joystick.style.left =
                touch.clientX + "px";

            joystick.style.top =
                touch.clientY + "px";

            joystick.currentTime = 0;

            joystick.play();

            touchActive = true;
        }

        lastTap = now;


        // TOQUE NORMAL = MOVER NAVE

        if(!joystickActive){

            if(ws.readyState === 1){

                ws.send(JSON.stringify({

                    type:"input",

                    targetX:
                        (touch.clientX / innerWidth)
                        * WORLD_WIDTH

                }));

            }

        }

    },{passive:false});


    // =========================
    // TOUCH MOVE
    // =========================

    addEventListener("touchmove",(e)=>{

        e.preventDefault();

        const touch = e.touches[0];


        // JOYSTICK ACTIVO = DISPARAR

        if(joystickActive){

            if(ws.readyState === 1){

                ws.send(JSON.stringify({

                    type:"input",

                    fire:true

                }));

            }

            return;
        }


        // MOVER NAVE

        if(ws.readyState === 1){

            ws.send(JSON.stringify({

                type:"input",

                targetX:
                    (touch.clientX / innerWidth)
                    * WORLD_WIDTH

            }));

        }

    },{passive:false});


    // =========================
    // TOUCH END
    // =========================

    addEventListener("touchend",()=>{

        touchActive = false;

        if(joystickActive){

            joystickActive = false;

            joystick.pause();

            joystick.style.display = "none";

        }

    });

}