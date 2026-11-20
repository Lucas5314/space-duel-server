
import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    SceneLoader
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF";

const canvas = document.getElementById("renderCanvas");

const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true
});

const scene = new Scene(engine);

scene.clearColor.set(0.5, 0.7, 0.9, 1);

const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 3,
    25,
    Vector3.Zero(),
    scene
);

camera.attachControl(canvas, true);
camera.wheelPrecision = 50;
camera.lowerRadiusLimit = 5;
camera.upperRadiusLimit = 100;

const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene
);

light.intensity = 1.2;

// CARGAR MUNDO
SceneLoader.Append(
    "assets/3d/worlds/",
    "mundo_principal.glb",
    scene,

    () => {
        console.log("🌎 Mundo 3D cargado");

        const loading = document.getElementById("loading");
        loading.style.display = "none";

        // ENCUADRAR ESCENARIO
        const meshes = scene.meshes.filter(
            mesh => mesh.getTotalVertices() > 0
        );

        if (meshes.length > 0) {
            const min = new Vector3(Infinity, Infinity, Infinity);
            const max = new Vector3(-Infinity, -Infinity, -Infinity);

            meshes.forEach(mesh => {
                mesh.computeWorldMatrix(true);

                const box = mesh.getBoundingInfo().boundingBox;

                min.minimizeInPlace(box.minimumWorld);
                max.maximizeInPlace(box.maximumWorld);
            });

            const center = min.add(max).scale(0.5);

            camera.setTarget(center);
            camera.radius = Vector3.Distance(min, max) * 0.8;
        }
    },

    null,

    (scene, message, exception) => {
        console.error("Error cargando mundo:", message, exception);

        document.getElementById("loading").textContent =
            "ERROR AL CARGAR EL MUNDO";
    }
);

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
