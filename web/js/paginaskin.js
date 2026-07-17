// ===========================
// BOTÓN VOLVER
// ===========================

document.getElementById("backBtn").onclick = ()=>{

    location.href = "skins.html";

};


// ===========================
// OBTENER ID
// ===========================

const params =
new URLSearchParams(window.location.search);

const id =
params.get("id") || "1";


// ===========================
// BASE DE DATOS DE SKINS
// ===========================

const skins = {

    1:{

        name:"TRUE YELLOW DIAMOND",

        image:"assets/ships/naveee1.png",

        description:
        "Una nave creada para explorar el universo y enfrentar cualquier desafío espacial.",

        rarity:"Común",

        state:"Desbloqueada",

        badge:"⭐ COMÚN"

    },


    2:{

        name:"SPACE RUBY",

        image:"assets/ships/naveee2.png",

        description:
        "Una nave de cristal rojo capaz de atravesar meteoritos.",

        rarity:"Épica",

        state:"Bloqueada",

        badge:"💎 ÉPICA"

    }

};


// ===========================
// CARGAR SKIN
// ===========================

const skin =
skins[id];

if(skin){

    document.getElementById("skinImage").src =
    skin.image;

    document.getElementById("skinName").textContent =
    skin.name;

    document.getElementById("skinDescription").textContent =
    skin.description;

    document.getElementById("skinRarity").textContent =
    skin.rarity;

    document.getElementById("skinState").textContent =
    skin.state;

    document.getElementById("rarity").textContent =
    skin.badge;

}