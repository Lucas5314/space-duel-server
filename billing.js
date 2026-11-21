import {
  NativePurchases,
  PURCHASE_TYPE
} from "@capgo/native-purchases";

function obtenerPlayerId() {
  const directId = localStorage.getItem("playerId");
  if (directId !== null && directId !== "") {
    const parsedDirect = Number(directId);
    if (Number.isInteger(parsedDirect) && parsedDirect > 0) {
      return parsedDirect;
    }
  }

  try {
    const savedPlayer = JSON.parse(localStorage.getItem("player"));
    const parsedPlayerId = savedPlayer ? Number(savedPlayer.id) : null;
    if (Number.isInteger(parsedPlayerId) && parsedPlayerId > 0) {
      return parsedPlayerId;
    }
  } catch (_) {}

  return null;
}

export async function comprarSkin() {
  const productoId = "skin_nave_roja";

  try {

    const { isBillingSupported } =
      await NativePurchases.isBillingSupported();

    if (!isBillingSupported) {

      alert("Este dispositivo no soporta compras.");

      return;

    }

    const { product } =
      await NativePurchases.getProduct({

        productIdentifier: productoId,

        productType: PURCHASE_TYPE.INAPP

      });

    const compra =
      await NativePurchases.purchaseProduct({

        productIdentifier: productoId,

        productType: PURCHASE_TYPE.INAPP,

        quantity: 1,

        isConsumable: true,

        autoAcknowledgePurchases: false

      });

    console.log(compra);

    const playerId = obtenerPlayerId();
    if (!Number.isInteger(playerId) || playerId <= 0) {
      alert("No se encontró un ID de jugador válido.");
      return;
    }

    const purchaseToken =
      compra?.purchaseToken ||
      compra?.token ||
      compra?.transactionId ||
      "";

    const response = await fetch("https://space-duel-server-1.onrender.com/api/purchases/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playerId,
        productId: productoId,
        purchaseToken
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      alert("Error al acreditar: " + (result.error || response.status));
      return;
    }

    if (typeof result.coins === "number") {
      try {
        const savedPlayer = JSON.parse(localStorage.getItem("player"));
        if (savedPlayer) {
          savedPlayer.coins = result.coins;
          localStorage.setItem("player", JSON.stringify(savedPlayer));
        }
      } catch (_) {}
    }

    alert("¡Compra realizada!");

  }

  catch (err) {

    console.error(err);

    alert("Compra cancelada o falló.");

  }

}