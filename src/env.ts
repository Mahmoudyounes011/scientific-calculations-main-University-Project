import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import {
  camera,
  controls,
  gui,
  renderer,
  scene,
  sizes,
  MainAnimationLoop,
  render,
} from "./init";
import { GROUND_HEIGHT } from "./constants";

let sky: Sky, sun: THREE.Vector3;

render();
sky = new Sky();
sky.scale.setScalar(3000);
function initSky() {
  // Add Sky

  scene.add(sky);

  sun = new THREE.Vector3();

  /// GUI
  let env = new Env();
  env.initEnv;
  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);
  }

  guiChanged();
}
export class Env {
  loadingManager = new THREE.LoadingManager();
  textureLoader = new THREE.TextureLoader(this.loadingManager);
  planeTex = this.textureLoader.load("/images/soil.jpg");
  groundGeometry = new THREE.PlaneGeometry(4000, 4000); // Adjust the size and segments as needed
  groundMaterial = new THREE.MeshBasicMaterial({ map: this.planeTex }); // Adjust the color and appearance
  groundMesh = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
  initEnv() {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    this.planeTex.wrapS = THREE.RepeatWrapping;
    this.planeTex.wrapT = THREE.RepeatWrapping;
    this.planeTex.repeat.set(5, 5);

    this.groundMesh.position.set(0, GROUND_HEIGHT, 0);
    this.groundMesh.rotation.x = Math.PI * -0.5; // Rotate the ground plane to be horizontal
    scene.add(this.groundMesh);

    initSky();
  }
  removeGround() {
    scene.remove(this.groundMesh);
    scene.remove(sky);
  }
}
