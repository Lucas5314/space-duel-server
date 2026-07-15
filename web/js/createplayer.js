const nameInput = document.getElementById("name");
const countrySelect = document.getElementById("country");
const continueBtn = document.getElementById("continueBtn");


// Si el jugador ya existe, ir directamente al perfil
if(localStorage.getItem("playerCreated") === "true"){

    location.href = "profile.html";

}


// Crear jugador
continueBtn.onclick = async () => {


    const name = nameInput.value.trim();


    if(name.length < 3){

        alert("El nombre debe tener al menos 3 caracteres.");

        return;

    }



    const country = countrySelect.value;



    try{


        // Enviar jugador al servidor

        const response = await fetch("/create-player", {


            method:"POST",


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify({


                username:name,


                country:country


            })


        });



        const data = await response.json();



        console.log(data);



        if(data.success){



            // Guardar jugador recibido de PostgreSQL

            localStorage.setItem(
                "player",
                JSON.stringify(data.player)
            );



            localStorage.setItem(
                "playerCreated",
                "true"
            );



            // Ir al perfil

            location.href = "profile.html";



        }else{


            alert(data.error);


        }



    }catch(error){


        console.log(error);


        alert(
            "No se pudo conectar con el servidor"
        );


    }



};



// Enter también funciona

nameInput.addEventListener("keydown", e=>{


    if(e.key==="Enter"){


        continueBtn.click();


    }


});