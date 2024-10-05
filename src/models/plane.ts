import * as THREE from "three";
import { clock, gltfLoader, scene } from "../init";

export class Plane {
  plane: THREE.Group;
  constructor() {
    this.plane = new THREE.Group();
    gltfLoader.load("/models/plane/plane.glb", (object) => {
      this.plane = object.scene;
      scene.add(this.plane);
      this.plane.rotation.y = -80;
    });
  }
}
