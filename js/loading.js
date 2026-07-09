const progress = document.getElementById("progress");
const percent = document.getElementById("percent");

// Lista de recursos que quieres precargar
const assets = [

    "assets/ships/naveee1.png",

    "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"

];

let loaded = 0;

function updateBar(){

    const p = Math.floor((loaded / assets.length) * 100);

    progress.style.width = p + "%";

    percent.textContent = p + "%";

    if(loaded === assets.length){

        setTimeout(()=>{

            location.href = "menu.html";

        },800);

    }

}

assets.forEach(asset=>{

    if(asset.endsWith(".png") ||
       asset.endsWith(".jpg") ||
       asset.endsWith(".jpeg") ||
       asset.endsWith(".webp")){

        const img = new Image();

        img.onload = ()=>{

            loaded++;

            updateBar();

        };

        img.onerror = ()=>{

            loaded++;

            updateBar();

        };

        img.src = asset;

    }

    else{

        const audio = new Audio();

        audio.oncanplaythrough = ()=>{

            loaded++;

            updateBar();

        };

        audio.onerror = ()=>{

            loaded++;

            updateBar();

        };

        audio.src = asset;

    }

});