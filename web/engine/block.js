class Block {


    constructor(data){


        this.id = data.id;


        // posición en el mundo
        this.x = data.x || 0;
        this.y = data.y || 0;


        // profundidad
        this.z = data.z || 0;


        // escala por perspectiva
        this.scale = data.scale || 1;


        // piezas del bloque

        this.floor =
        data.floor || null;


        this.leftWall =
        data.leftWall || null;


        this.rightWall =
        data.rightWall || null;



        // objetos decorativos

        this.objects =
        data.objects || [];



        // si bloquea

        this.solid =
        data.solid ?? true;


    }



    update(){


        // movimiento hacia el jugador

        this.z -= 5;



        // escala según distancia

        this.scale =
        1000 / (this.z + 1000);



    }



    draw(){


        // dibujar suelo

        if(this.floor){

            this.floor.draw(
                this.x,
                this.y,
                this.scale
            );

        }



        // pared izquierda

        if(this.leftWall){

            this.leftWall.draw(
                this.x,
                this.y,
                this.scale
            );

        }



        // pared derecha

        if(this.rightWall){

            this.rightWall.draw(
                this.x,
                this.y,
                this.scale
            );

        }



        // decoración

        for(
            const obj of this.objects
        ){

            obj.draw(
                this.x,
                this.y,
                this.scale
            );

        }


    }



}