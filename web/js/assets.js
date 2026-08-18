// ================= ASSETS =================

const ship = new Image();
ship.src = "assets/ships/naveee1.png";


const portalImage = new Image();
portalImage.src = "assets/portal.gif";


// ================= BULLET =================

const bulletImage = new Image();
bulletImage.src = "assets/bullets/bullet1.png";


// ================= SOUND =================

const shootSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"
);

shootSound.volume = 0.25;


// ================= EXPORT =================

export {
    ship,
    portalImage,
    bulletImage,
    shootSound
};