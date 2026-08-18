export function showMatchIntro(){

    const intro =
        document.getElementById("matchIntro");

    intro.style.display = "flex";

    setTimeout(()=>{

        intro.style.display = "none";

    },2500);

}