import { LocalNotifications } from '@capacitor/local-notifications';


// ===========================
// PEDIR PERMISOS
// ===========================

async function enableNotifications(){

    const permission = await LocalNotifications.requestPermissions();


    if(permission.display === "granted"){

        console.log("Notificaciones activadas");


    }else{

        console.log("Permiso rechazado");

    }

}



// ===========================
// CREAR NOTIFICACIÓN
// ===========================

async function sendWelcomeNotification(){


    await LocalNotifications.schedule({

        notifications:[

            {

                title:"🚀 Space Tip",

                body:"Tu nave está lista para la batalla",

                id:1,


                schedule:{

                    at:new Date(Date.now()+5000)

                }

            }

        ]

    });


}



// Activar

enableNotifications();

sendWelcomeNotification();