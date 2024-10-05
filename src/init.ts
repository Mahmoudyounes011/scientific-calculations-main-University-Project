import * as THREE from "three";
// import { GUI } from "@types/dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import {
  CAMERA_STARTING_POSITION,
  MAX_DISTANCE,
  MIN_DISTANCE,
} from "./constants";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as Gui from "dat.gui";

// Debug, this is the control panel we will need it to change the physics later
export const gui = new Gui.GUI({ closed: true });

// Canvas three.js stuff
export const canvas: HTMLElement = document.querySelector("#webgl")!;

// Scene three.js stuff
export const scene = new THREE.Scene();

// Sizes, to determine the screen edges, we will need this to keep the scene good looking when the user resize the browser window
export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
export let aspect = sizes.width / sizes.height;
export const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000000);
// next three lines will set the camera starting position
camera.position.x = CAMERA_STARTING_POSITION.x;
camera.position.y = CAMERA_STARTING_POSITION.y;
camera.position.z = CAMERA_STARTING_POSITION.z;
scene.add(camera);

// Renderer, three.js stuff
export const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

export const gltfLoader = new GLTFLoader();
export const clock = new THREE.Clock();

renderer.setSize(sizes.width, sizes.height);

// Utilities
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  aspect = sizes.width / sizes.height;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

// Controls this is to control the objects by mouse, rotate and drag&drop, i think we don't need it but I'll keep it for the meantime
export const controls = new MapControls(camera, canvas);
controls.enableDamping = true;
controls.maxZoom = 1;

controls.maxDistance = MAX_DISTANCE;
controls.minDistance = MIN_DISTANCE;
controls.maxPolarAngle = Math.PI / 2; // radians/
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN,
};

controls.update();

// three.js stuff
export function render() {
  renderer.render(scene, camera);
}

// this is infinite loop, we will use it as a starting point

export function MainAnimationLoop(...arg: Function[]) {
  arg.forEach((func) => {
    func();
  });
  controls.update();
  render();
  requestAnimationFrame(() => {
    MainAnimationLoop(...arg);
  });
}
