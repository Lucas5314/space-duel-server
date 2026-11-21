import {
  NativePurchases,
  PURCHASE_TYPE
} from "@capgo/native-purchases";

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

        quantity: 1

      });

    console.log(compra);

    const playerId = Number(localStorage.getItem("playerId"));
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

    alert("¡Compra realizada!");

  }

  catch (err) {

    console.error(err);

    alert("Compra cancelada o falló.");

  }

}