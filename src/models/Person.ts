import * as THREE from "three";
import { clock, gltfLoader, scene } from "../init";
import { radToDeg } from "three/src/math/MathUtils";
import { degToRadian } from "../utilities/helpers";

export class Person {
  person: THREE.Group;
  parachute: THREE.Group;
  isPersonJumped: boolean = false;
  isParachuteOpened: boolean = false;
  isDead: boolean = false;
  constructor() {
    this.person = new THREE.Group();
    this.parachute = new THREE.Group();
    gltfLoader.load(
      "/models/human/rigged_human_character_free.glb",
      (object) => {
        object.scene.scale.set(3, 3, 4);
        this.person = object.scene;
        console.log(object);
      }
    );
    gltfLoader.load("/models/parachute/parachute(Optimized).gltf", (object) => {
      object.scene.scale.set(7, 7, 7);
      object.scene.rotateY(80);
      this.parachute = object.scene;
    });
  }
  jump() {
    this.isPersonJumped = true;
    scene.add(this.person);

    this.person.rotation.z = degToRadian(180);
  }
  openParachute() {
    this.isParachuteOpened = true;
    this.parachute.position.copy(this.person.position);
    this.person.rotateY(radToDeg(80));
    // this for correcting parachute position -------
    this.parachute.position.x += 3.6;
    this.parachute.position.y += 2.8;
    this.parachute.position.z -= 2.8;
    // ----------------------------------------------
    scene.add(this.parachute);
  }
  closeParachute() {
    scene.remove(this.parachute);
  }
  die() {
    scene.remove(this.parachute);
    scene.remove(this.person);
    this.isDead = true;
  }
}
