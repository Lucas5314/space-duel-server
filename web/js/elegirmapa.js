document.querySelectorAll(".mapa").forEach(mapa => {

    mapa.addEventListener("click", () => {

        const world = mapa.dataset.world;

        localStorage.setItem("selectedWorld", world);

        window.location.href = "profile.html";

    });

});