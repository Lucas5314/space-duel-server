const claimBtn = document.getElementById("claimBtn");

const giftIcon = document.querySelector(".gift-icon");
const skinCard = document.querySelector(".skin-card");



claimBtn.onclick = () => {


    // bloquear botón
    claimBtn.disabled = true;


    // animación caja abriéndose
    giftIcon.classList.add("open");


    claimBtn.innerHTML = "✨ Abriendo regalo...";



    setTimeout(()=>{


        giftIcon.style.display = "none";


        createParticles();



        skinCard.classList.add("show");



        claimBtn.innerHTML = "✅ SKIN DESBLOQUEADA";


        claimBtn.classList.add("claimed");



        console.log("Skin agregada al inventario");


    },1500);



};





function createParticles(){


    for(let i = 0; i < 25; i++){


        let particle = document.createElement("span");


        particle.className = "particle";


        particle.innerHTML = "✨";


        particle.style.left = Math.random()*100 + "%";


        particle.style.top = Math.random()*100 + "%";



        document.querySelector(".gift-box")
        .appendChild(particle);



        setTimeout(()=>{

            particle.remove();

        },2000);



    }


}