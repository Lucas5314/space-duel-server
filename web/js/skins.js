const skins = [

{
    id:"nave1",
    nombre:"Nave Azul",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:true,
    rareza:"Común"
},

{
    id:"nave2",
    nombre:"Nave Roja",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave3",
    nombre:"Nave Dorada",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave4",
    nombre:"Nave Galaxia",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave5",
    nombre:"Nave Eclipse",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave6",
    nombre:"Nave Fénix",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave7",
    nombre:"Nave Plasma",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave8",
    nombre:"Nave Nebulosa",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave9",
    nombre:"Nave Cometa",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Común"
},

{
    id:"nave10",
    nombre:"Nave Aurora",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave11",
    nombre:"Nave Titan",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave12",
    nombre:"Nave Omega",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave13",
    nombre:"Nave Solar",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave14",
    nombre:"Nave Lunar",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave15",
    nombre:"Nave Void",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave16",
    nombre:"Nave Neon",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave17",
    nombre:"Nave Hunter",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave18",
    nombre:"Nave Dragon",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave19",
    nombre:"Nave Shadow",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave20",
    nombre:"Nave Legendaria",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:false,
    rareza:"Mítica"
}

];



const container = document.getElementById("skinsContainer");


let equipada =
localStorage.getItem("selectedShip") || "nave1";



function render(){


    container.innerHTML="";



    skins.forEach(skin=>{


        const card =
        document.createElement("div");


        card.className="card";



        const boton = skin.desbloqueada

        ? 
        (skin.id===equipada ? "Equipada" : "Equipar")

        :

        "Bloqueada";




        card.innerHTML = `


        <h2>${skin.nombre}</h2>


        <img src="${skin.imagen}">


        <p>${skin.rareza}</p>



        <button
        ${skin.desbloqueada ? "" : "disabled"}
        data-id="${skin.id}">

        ${boton}

        </button>


        `;



        container.appendChild(card);



    });




    document
    .querySelectorAll("button[data-id]")
    .forEach(btn=>{


        btn.onclick=()=>{


            equipada =
            btn.dataset.id;


            localStorage.setItem(
            "selectedShip",
            equipada
            );


            render();


        };


    });



}





render();





document.getElementById("back").onclick=()=>{


    location.href="profile.html";


};