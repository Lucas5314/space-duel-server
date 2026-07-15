// ================= JUGADORES (TEMPORAL) =================

const players = [

    {
        name:"Ricardo",
        country:"🇵🇾",
        level:25,
        wins:530
    },

    {
        name:"Shadow",
        country:"🇧🇷",
        level:21,
        wins:470
    },

    {
        name:"Falcon",
        country:"🇺🇸",
        level:18,
        wins:430
    },

    {
        name:"Nova",
        country:"🇦🇷",
        level:16,
        wins:395
    },

    {
        name:"Astro",
        country:"🇨🇱",
        level:15,
        wins:360
    },

    {
        name:"Galaxy",
        country:"🇲🇽",
        level:14,
        wins:340
    },

    {
        name:"Comet",
        country:"🇪🇸",
        level:13,
        wins:315
    },

    {
        name:"Orion",
        country:"🇫🇷",
        level:12,
        wins:290
    }

];

// ================= ELEMENTOS =================

const rankingList = document.getElementById("rankingList");
const backBtn = document.getElementById("backBtn");

// ================= CREAR RANKING =================

players.forEach((player,index)=>{

    const card = document.createElement("div");

    card.className = "player";

    if(index===0){

        card.classList.add("gold");

    }else if(index===1){

        card.classList.add("silver");

    }else if(index===2){

        card.classList.add("bronze");

    }

    let medal = (index+1);

    if(index===0) medal = "🥇";
    if(index===1) medal = "🥈";
    if(index===2) medal = "🥉";

    card.innerHTML = `

        <div class="position">

            ${medal}

        </div>

        <div class="info">

            <div class="name">

                ${player.name} ${player.country}

            </div>

            <div class="level">

                ⭐ Nivel ${player.level}

            </div>

            <div class="wins">

                🏆 ${player.wins} Victorias

            </div>

        </div>

    `;

    rankingList.appendChild(card);

});

// ================= VOLVER =================

backBtn.onclick = ()=>{

    location.href = "profile.html";

};