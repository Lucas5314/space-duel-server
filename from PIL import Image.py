from PIL import Image
import numpy as np

def clasificar_imagen(path):
    img = Image.open(path).resize((64, 64))
    img = np.array(img)

    # convertir a float
    img = img / 255.0

    # separar canales
    r, g, b = img[:,:,0], img[:,:,1], img[:,:,2]

    # brillo
    brightness = img.mean()

    # saturación aproximada
    saturation = np.std(img, axis=2).mean()

    # textura (variación)
    textura = np.std(img)

    # =========================
    # REGLAS
    # =========================

    # 🟥 tierra (rojizo / marrón)
    if (r.mean() > g.mean()) and (r.mean() > b.mean()) and saturation > 0.05:
        return "no_pavimentada"

    # ⚫ asfalto (oscuro + uniforme)
    if brightness < 0.4 and textura < 0.15:
        return "pavimentada"

    # ⚪ concreto (gris claro uniforme)
    if brightness > 0.6 and textura < 0.1:
        return "pavimentada"

    # ⚠️ irregular
    if textura > 0.2:
        return "no_pavimentada"

    return "desconocido"