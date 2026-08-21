import { App } from "@capacitor/app";

const page = location.pathname.split("/").pop();

const protectedPages = [
    "profile.html",
    "game.html"
];

if(protectedPages.includes(page)){

    App.addListener("backButton", async () => {

        const salir = confirm(
            "¿Seguro que quieres salir del juego?\n\nSe cerrará la aplicación."
        );

        if(salir){

            await App.exitApp();

        }

    });

}