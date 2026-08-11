const clickSound = new Audio("assets/audio/click.mp3");

clickSound.volume = 0.4;
const rarityImages = {
    "Común": "assets/icons/comun.png",
    "Rara": "assets/icons/raro.png",
    "Épica": "assets/icons/epico.png",
    "Legendaria": "assets/icons/legendario.png",
    "Mítica": "assets/icons/mitico.png"
};
const skins = [

{
    id:"nave1",
    nombre:"Nave Azul",
    imagen:"assets/icons/nave1.png",
    desbloqueada:true,
    rareza:"Común",
    tipo:"gratis",
    precio:0
},

{
    id:"nave2",
    nombre:"Nave Roja",
    imagen:"assets/icons/nave2.png",
    desbloqueada:false,
    rareza:"Rara",
    tipo:"compra",
    precio:1.99,
    productoId:"skin_nave_roja"
},

{
    id:"nave3",
    nombre:"Nave Dorada",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave4",
    nombre:"Nave Galaxia",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave5",
    nombre:"Nave Eclipse",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave6",
    nombre:"Nave Fénix",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave7",
    nombre:"Nave Plasma",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave8",
    nombre:"Nave Nebulosa",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave9",
    nombre:"Nave Cometa",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Común"
},

{
    id:"nave10",
    nombre:"Nave Aurora",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave11",
    nombre:"Nave Titan",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave12",
    nombre:"Nave Omega",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave13",
    nombre:"Nave Solar",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave14",
    nombre:"Nave Lunar",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave15",
    nombre:"Nave Void",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave16",
    nombre:"Nave Neon",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave17",
    nombre:"Nave Hunter",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Rara"
},

{
    id:"nave18",
    nombre:"Nave Dragon",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Legendaria"
},

{
    id:"nave19",
    nombre:"Nave Shadow",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Épica"
},

{
    id:"nave20",
    nombre:"Nave Legendaria",
    imagen:"assets/icons/naveee1.png",
    desbloqueada:false,
    rareza:"Mítica"
}

];

const container =
document.getElementById("skinsContainer");

let equipada =
localStorage.getItem("selectedShip") || "nave1";

function render(){

    container.innerHTML="";

    skins.forEach(skin=>{

        const card =
        document.createElement("div");

        card.className="card";

        // Abrir ficha de la skin
        card.onclick=()=>{

            location.href =
            "paginaskin.html?id=" + skin.id;

        };

const boton =

skin.desbloqueada

?

(skin.id === equipada ? "Equipada" : "Equipar")

:

(skin.tipo === "compra"

? `Comprar ($${skin.precio})`

: "Bloqueada");

card.innerHTML = `
<img 
class="rarityBadge"
src="${rarityImages[skin.rareza]}"
alt="${skin.rareza}">
    <h2>${skin.nombre}</h2>


    <img 
    src="${skin.imagen}">


    <button
    data-id="${skin.id}">

    ${boton}

    </button>

`;

container.appendChild(card);

});

document
.querySelectorAll("button[data-id]")
.forEach(btn => {

    btn.onclick = (e) => {

    e.stopPropagation();


    clickSound.currentTime = 0;
    clickSound.play();
;

        const skin =
        skins.find(
            s => s.id === btn.dataset.id
        );

        if (!skin.desbloqueada) {

            alert(
                "Aquí iniciaremos la compra con Google Play."
            );

            return;

        }

        equipada = skin.id;

        localStorage.setItem(
            "selectedShip",
            equipada
        );

        render();

    };

});

}

render();

document.getElementById("back").onclick = () => {

    clickSound.currentTime = 0;
    clickSound.play();

    setTimeout(()=>{

        location.href = "profile.html";

    },120);

};
document.querySelectorAll("button").forEach(btn=>{

    btn.addEventListener("click",()=>{

        clickSound.currentTime = 0;

        clickSound.play();

    });

});