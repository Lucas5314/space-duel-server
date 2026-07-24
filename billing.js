import {
  NativePurchases,
  PURCHASE_TYPE
} from "@capgo/native-purchases";

export async function comprarSkin(productoId){

    try{

        const { isBillingSupported } =
        await NativePurchases.isBillingSupported();

        if(!isBillingSupported){

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

            quantity:1

        });

        console.log(compra);

        alert("¡Compra realizada!");

    }

    catch(err){

        console.error(err);

        alert("Compra cancelada o falló.");

    }

}