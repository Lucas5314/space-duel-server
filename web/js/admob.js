// ================= ADMOB (CAPACITOR 8 FIX REAL) =================

let matchCount = 0;
let AdMobReady = false;

async function initAdMob(){

  console.log("=== INIT ADMOB ===");

  try{

    if(!window.Capacitor?.Plugins){

      console.log("Capacitor Plugins NO encontrados");
      return;

    }

    console.log("Capacitor encontrado");

    const { AdMob } = window.Capacitor.Plugins;

    console.log("Inicializando AdMob...");

    await AdMob.initialize({
      requestTrackingAuthorization: true,
      initializeForTesting: false
    });

    AdMobReady = true;

    console.log("AdMob listo");

  }catch(e){

    console.log("Error inicializando AdMob:", e);

  }

}

document.addEventListener("DOMContentLoaded", initAdMob);

async function showInterstitialAd(){

  console.log("=== showInterstitialAd() ===");

  if(!AdMobReady){

    console.log("AdMobReady = FALSE");
    return;

  }

  console.log("AdMobReady = TRUE");

  try{

    const { AdMob } = window.Capacitor.Plugins;

    console.log("Preparando anuncio...");

    await AdMob.prepareInterstitial({

      adId: "ca-app-pub-9974496135349488/6520313527"

    });

    console.log("Anuncio preparado");

    console.log("Mostrando anuncio...");

    await AdMob.showInterstitial();

    console.log("Anuncio mostrado");

  }catch(e){

    console.log("ERROR mostrando anuncio:", e);

  }

}