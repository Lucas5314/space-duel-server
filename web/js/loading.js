const progress = document.getElementById("progress");
const percent = document.getElementById("percent");

// Música del loading
const music = new Audio("assets/audio/loading.mp3");

music.loop = true;
music.volume = 0.35;

// Intentar reproducir (si el dispositivo lo permite)
music.play().catch(()=>{});

// Recursos que se precargarán
const assets = [

    "assets/ships/naveee1.png",

    "assets/audio/loading.mp3",

    "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"

];

let loaded = 0;

function updateBar(){

    const p = Math.floor((loaded / assets.length) * 100);

    progress.style.width = p + "%";

    percent.textContent = p + "%";

    if(loaded === assets.length){

        setTimeout(()=>{

            music.pause();
            music.currentTime = 0;

            if(localStorage.getItem("playerCreated") === "true"){

                location.href = "profile.html";

            }else{

                location.href = "createplayer.html";

            }

        },800);

    }

}

assets.forEach(asset=>{

    if(
        asset.endsWith(".png") ||
        asset.endsWith(".jpg") ||
        asset.endsWith(".jpeg") ||
        asset.endsWith(".webp")
    ){

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

    }else{

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