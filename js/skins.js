const skins = [

{
    id:"nave1",
    nombre:"Nave Azul",
    imagen:"assets/ships/naveee1.png",
    desbloqueada:true
},

{
    id:"nave2",
    nombre:"Nave Roja",
    imagen:"assets/ships/naveee2.png",
    desbloqueada:false
},

{
    id:"nave3",
    nombre:"Nave Dorada",
    imagen:"assets/ships/naveee3.png",
    desbloqueada:false
}

];

const container = document.getElementById("skinsContainer");

let equipada = localStorage.getItem("selectedShip") || "nave1";

function render(){

    container.innerHTML="";

    skins.forEach(skin=>{

        const card=document.createElement("div");

        card.className="card";

        const boton = skin.desbloqueada

            ? (skin.id===equipada ? "Equipada" : "Equipar")

            : "Bloqueada";

        card.innerHTML=`

        <h2>${skin.nombre}</h2>

        <img src="${skin.imagen}">

        <button
            ${skin.desbloqueada ? "" : "disabled"}
            data-id="${skin.id}">

            ${boton}

        </button>

        `;

        container.appendChild(card);

    });

    document.querySelectorAll("button[data-id]").forEach(btn=>{

        btn.onclick=()=>{

            equipada=btn.dataset.id;

            localStorage.setItem("selectedShip",equipada);

            render();

        };

    });

}

render();

document.getElementById("back").onclick=()=>{

    location.href="menu.html";

};