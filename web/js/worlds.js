const worlds = {

    space:{
        name:"Espacio",
        
        background:"assets/worlds/space/background.png",

        player:{
            image:"assets/worlds/space/ship.png"
        },

        bullet:{
            image:"assets/worlds/space/laser.png"
        },

        sounds:{
            shoot:"assets/worlds/space/laser.mp3",
            hit:"assets/worlds/space/hit.mp3"
        },

        effects:{
            explosion:"spaceExplosion"
        },

        rules:{
            gravity:false,
            wind:false
        }
    },



    western:{
        name:"Viejo Oeste",

        background:"assets/worlds/western/background.png",

        player:{
            image:"assets/worlds/western/cowboy.png"
        },

        bullet:{
            image:"assets/worlds/western/bullet.png"
        },

        sounds:{
            shoot:"assets/worlds/western/revolver.mp3",
            hit:"assets/worlds/western/hit.mp3"
        },

        effects:{
            explosion:"dust"
        },

        rules:{
            gravity:false,
            wind:true
        }
    },



    frozen:{
        name:"Planeta Congelado",

        background:"assets/worlds/frozen/background.png",

        player:{
            image:"assets/worlds/frozen/character.png"
        },

        bullet:{
            image:"assets/worlds/frozen/ice.png"
        },

        sounds:{
            shoot:"assets/worlds/frozen/iceShot.mp3",
            hit:"assets/worlds/frozen/iceHit.mp3"
        },

        effects:{
            explosion:"snow"
        },

        rules:{
            gravity:false,
            wind:true,
            slippery:true
        }
    },



    volcanic:{
        name:"Mundo Volcánico",

        background:"assets/worlds/volcanic/background.png",

        player:{
            image:"assets/worlds/volcanic/warrior.png"
        },

        bullet:{
            image:"assets/worlds/volcanic/fireball.png"
        },

        sounds:{
            shoot:"assets/worlds/volcanic/fire.mp3",
            hit:"assets/worlds/volcanic/lava.mp3"
        },

        effects:{
            explosion:"fire"
        },

        rules:{
            lava:true,
            heat:true
        }
    },



    jungle:{
        name:"Selva Alienígena",

        background:"assets/worlds/jungle/background.png",

        player:{
            image:"assets/worlds/jungle/player.png"
        },

        bullet:{
            image:"assets/worlds/jungle/thorn.png"
        },

        sounds:{
            shoot:"assets/worlds/jungle/shoot.mp3",
            hit:"assets/worlds/jungle/hit.mp3"
        },

        effects:{
            explosion:"leaves"
        },

        rules:{
            fog:true,
            creatures:true
        }
    },



    cyberCity:{
        name:"Ciudad Cyber",

        background:"assets/worlds/cyber/background.png",

        player:{
            image:"assets/worlds/cyber/robot.png"
        },

        bullet:{
            image:"assets/worlds/cyber/plasma.png"
        },

        sounds:{
            shoot:"assets/worlds/cyber/plasma.mp3",
            hit:"assets/worlds/cyber/electric.mp3"
        },

        effects:{
            explosion:"electric"
        },

        rules:{
            rain:true,
            neon:true
        }
    }

};