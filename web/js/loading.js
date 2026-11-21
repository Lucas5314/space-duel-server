const progress = document.getElementById("progress");
const percent = document.getElementById("percent");
const loadingText = document.getElementById("loadingText");

const messages = [
    "Preparing battle...",
    "Loading assets...",
    "Connecting server...",
    "Synchronizing data...",
    "Almost ready..."
];

// Música del loading
const music = new Audio("assets/audio/loading.mp3");
music.loop = true;
music.volume = 0.35;
music.play().catch(()=>{});

// Lista completa generada de tus assets reales
const assets = [
    "assets/portal.gif",
    "assets/3d/textures/Textures/colormap.png",
    "assets/3d/worlds/textures/colormap.png",
    "assets/audio/battle.mp3",
    "assets/audio/click.m4a",
    "assets/audio/disparo.mp3",
    "assets/audio/explosion.mp3",
    "assets/audio/impacto.mp3",
    "assets/audio/loading.mp3",
    "assets/audio/matchmaking.mp3",
    "assets/audio/menu.mp3",
    "assets/audio/motor.mp3",
    "assets/audio/movimiento.mp3",
    "assets/audio/profile.mp3",
    "assets/audio/result.mp3",
    "assets/audio/versus.mp3",
    "assets/audio/yellowruby.ogg",
    "assets/backgrounds/amarillooo.png",
    "assets/backgrounds/hangar.png",
    "assets/backgrounds/loading.png",
    "assets/backgrounds/logotipo.png",
    "assets/backgrounds/mapa.mp4",
    "assets/backgrounds/premiodiariofondo.png",
    "assets/backgrounds/reward.png",
    "assets/backgrounds/settings.png",
    "assets/bullets/bullet1.png",
    "assets/countdown/1.png",
    "assets/countdown/2.png",
    "assets/countdown/3.png",
    "assets/countdown/fight.jpeg",
    "assets/demo3d/bullet1 - Copia (5).png",
    "assets/demo3d/bullet1 - Copia (6).png",
    "assets/demo3d/bullet1 - Copia (7).png",
    "assets/demo3d/bullet1 - Copia.png",
    "assets/demo3d/bullet1.png",
    "assets/demo3d/ship_000.png",
    "assets/demo3d/ship_010.png",
    "assets/demo3d/ship_050.png",
    "assets/effects/explosion.webm",
    "assets/effects/particle1.gif",
    "assets/effects/particle2.gif",
    "assets/effects/particle3.gif",
    "assets/emotes/default.mp4",
    "assets/events/news01.png",
    "assets/icons/card.png",
    "assets/icons/chat.png",
    "assets/icons/comun.png",
    "assets/icons/epico.png",
    "assets/icons/invite.png",
    "assets/icons/legendario.png",
    "assets/icons/mitico.png",
    "assets/icons/nivel.jpeg",
    "assets/icons/ranking.png",
    "assets/icons/raro.png",
    "assets/icons/settings.png",
    "assets/icons/skins.png",
    "assets/icons/voltar - Copia.jpeg",
    "assets/intro/background.png",
    "assets/intro/logo.webm",
    "assets/intro/ruby.png",
    "assets/intro/yellow.png",
    "assets/invite/boton-invitar.png",
    "assets/invite/titulo-invitar.png",
    "assets/mapasaelegir/espacio.png",
    "assets/mapasaelegir/nombre-bosque.png",
    "assets/mapasaelegir/nombre-hielo.png",
    "assets/mapasaelegir/nombre-oeste.png",
    "assets/mapasaelegir/oeste.png",
    "assets/mapasaelegir/viejooeste - Copia.jpg",
    "assets/mapasaelegir/volcan.png",
    "assets/maps/objeto1.png",
    "assets/maps/objeto2.png",
    "assets/maps/callejon/floor.png",
    "assets/maps/callejon/objeto1.png",
    "assets/maps/callejon/objeto2.png",
    "assets/maps/callejon/objeto3.png",
    "assets/maps/callejon/objeto4.png",
    "assets/premiodiario/boton-volver.png",
    "assets/premiodiario/header.png",
    "assets/premiodiario/titulo-premio-diario.png",
    "assets/result/continue.png",
    "assets/ships/demo3d/ship_000.png",
    "assets/ships/demo3d/ship_0180.png",
    "assets/ships/demo3d/ship_090.png",
    "assets/ships/demo3d/ship_270.png",
    "assets/stickers/corona.jpg",
    "assets/stickers/fuego.jpg",
    "assets/stickers/gg.jpg",
    "assets/ui/barra.png",
    "assets/ui/bienvenido.png",
    "assets/ui/btn-play.png",
    "assets/ui/buttoncontinue.png",
    "assets/ui/callejon.jpeg",
    "assets/ui/chest.png",
    "assets/ui/claim-button.png",
    "assets/ui/coin.png",
    "assets/ui/coins.png",
    "assets/ui/divider.png",
    "assets/ui/green.jpeg",
    "assets/ui/joystick.mp4",
    "assets/ui/loading-bar.png",
    "assets/ui/playercard.png",
    "assets/ui/red.jpeg",
    "assets/ui/reward-title.png",
    "assets/ui/settings.png",
    "assets/ui/ship-base.webm",
    "assets/ui/ship-energy.webm",
    "assets/ui/skins.png",
    "assets/ui/voltar.png",
    "assets/ui/vs.png",
    "assets/ui/countdown/1.png",
    "assets/ui/countdown/2.png",
    "assets/ui/countdown/3.png",
    "assets/ui/countdown/fight.jpeg",
    "assets/ui/ranking/ranking.png",
    "assets/world/spacetip-world.jpeg",
    "assets/worlds/city.jpg",
    "assets/worlds/fondo.mp4",
    "assets/worlds/volcano.jpg"
];

let loaded = 0;

function updateBar() {
    const p = Math.floor((loaded / assets.length) * 100);
    if (progress) progress.style.width = p + "%";
    if (percent) percent.textContent = p + "%";

    const msgIndex = Math.min(Math.floor((p / 100) * messages.length), messages.length - 1);
    if (loadingText) {
        loadingText.textContent = messages[msgIndex];
    }

    if (loaded >= assets.length) {
        setTimeout(() => {
            music.pause();
            music.currentTime = 0;

            if (localStorage.getItem("playerCreated") === "true") {
                location.href = "profile.html";
            } else {
                location.href = "createplayer.html";
            }
        }, 800);
    }
}

function assetLoaded() {
    loaded++;
    updateBar();
}

if (assets.length === 0) {
    updateBar();
} else {
    assets.forEach(asset => {
        // Si es una imagen o GIF
        if (asset.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
            const img = new Image();
            img.onload = assetLoaded;
            img.onerror = assetLoaded; 
            img.src = asset;
        } 
        // Si es audio, video u otro recurso pesado
        else {
            let finished = false;
            const safeFinish = () => {
                if (!finished) {
                    finished = true;
                    assetLoaded();
                }
            };

            if (asset.match(/\.(mp3|m4a|ogg)$/i)) {
                const audio = new Audio();
                audio.oncanplaythrough = safeFinish;
                audio.onerror = safeFinish;
                setTimeout(safeFinish, 3000); // Respaldo de 3s por si el navegador móvil se bloquea
                audio.src = asset;
            } else {
                // Para videos (.mp4, .webm) u otros archivos
                const media = document.createElement(asset.endsWith('.webm') || asset.endsWith('.mp4') ? 'video' : 'object');
                media.onloadeddata = safeFinish;
                media.onerror = safeFinish;
                setTimeout(safeFinish, 3000);
                media.src = asset;
            }
        }
    });
}