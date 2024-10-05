import * as THREE from "three";
import { Env } from "./env";
import { scene, MainAnimationLoop, controls, clock, gui, camera } from "./init";
import { Plane } from "./models/plane";
import { Person } from "./models/Person";
import {
  degToRadian,
  updateAccelerationText,
  updateAngelHorizenText,
  updateDragForceText,
  updateInfoText,
  updateJumpTimeText,
  updateVelocityText,
} from "./utilities/helpers";
import {
  CalculateCurrentPosition,
  calculateDragForce,
  Calculate_Current_Velocity,
  calculate_Initial_Values,
  Calculate_Current_Acceleration,
} from "./physics";
import { GROUND_HEIGHT } from "./constants";
import { VideoTexture } from "three";
// Define the variables that you want to control in the GUI
const params = {
  mass: 70,
  vJump: 1,
  airDensity: 1.255,
  PersonA: 2,
  alpha: 0,
  Beta: 80,
  jumpAngel: 0,
  ParachuteA: 12,
  Cd: 0.8,
  Cl: 1.6,
  liftForce: 3,
  vPlane: 40,
};
const video = document.createElement("video");
video.src = "/images/vid.mp4";
video.load();
const videoTexture = new VideoTexture(video);
const videoPlaneGeometry = new THREE.PlaneGeometry(10, 10); // Adjust the size as needed
const videoPlaneMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const videoPlane = new THREE.Mesh(videoPlaneGeometry, videoPlaneMaterial);
videoPlane.position.set(0, 50, 0); // Adjust the position as needed
scene.add(videoPlane);

// control the values throw the GUI
gui.add(params, "mass", 1, 200).step(1);
gui.add(params, "vJump", 0, 10).step(0.1);
gui.add(params, "airDensity", 1, 2).step(0.001);
gui.add(params, "PersonA", 1, 10).step(0.1);
gui.add(params, "alpha", 1, 180).step(1);
gui.add(params, "ParachuteA", 1, 20).step(0.1);
gui.add(params, "Cd", 0, 1).step(0.01);
gui.add(params, "Cl", 0, 2).step(0.01);
gui.add(params, "liftForce", 1, 30).step(1);
gui.add(params, "vPlane", 10, 200).step(1);

const light = new THREE.AmbientLight(0xffffff, 0.2);
light.position.set(0, 10, 5);
const sunLight = new THREE.DirectionalLight(0xffffff, 5); // Color: white, Intensity: 1
sunLight.position.set(0, 50, 10); // Adjust the position of the light as needed
const g = 9.8;
scene.add(sunLight);
scene.add(light);
// Add Sky
let env = new Env();
env.initEnv();
let velocity = new THREE.Vector3();
let acceleration = new THREE.Vector3();
let dragForce = new THREE.Vector3();
let t = 0;
let position = new THREE.Vector3();
// const mass = 70;

const plane = new Plane();
const person = new Person();

// controls
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !person.isPersonJumped) {
    if (person.person) {
      calculate_Initial_Values(
        params.mass,
        g,
        params.vJump,
        params.vPlane,
        params.alpha,
        params.PersonA,
        params.Cd,
        params.airDensity,
        velocity,
        dragForce,
        acceleration,
        params.Beta
      );
      person.person.position.copy(plane.plane.position);
      position.x = -plane.plane.position.x;
      position.y = -plane.plane.position.y;
      position.z = -plane.plane.position.z;
      person.person.position.y -= 3;
      person.jump();

      updateInfoText(`press "E" to open the parachute `);
      updateVelocityText(velocity.x, velocity.y, velocity.z, velocity.length());
      updateAccelerationText(
        acceleration.length(),
        acceleration.x,
        acceleration.y,
        acceleration.z
      );
      updateDragForceText(
        dragForce.length(),
        dragForce.x,
        dragForce.y,
        dragForce.z
      );
    }
  }
  if (
    event.code === "KeyE" &&
    person.isPersonJumped &&
    !person.isParachuteOpened
  ) {
    person.openParachute();
    params.Beta = 85;
    params.alpha = 0;
    updateInfoText("");
  }

  // if (event.code === "KeyD" && person.isPersonJumped) {
  //   // params.alpha = params.alpha === 85 ? params.alpha : params.alpha + 1;
  //   params.alpha = params.alpha + 1;
  // }
  // if (event.code === "KeyA" && person.isPersonJumped) {
  //   // params.alpha = params.alpha <= 1 ? params.alpha : params.alpha - 1;
  //   params.alpha = params.alpha - 1;
  // }
  if (event.code === "KeyW" && person.isPersonJumped) {
    if (person.isParachuteOpened) {
      params.liftForce === 1 ? params.liftForce : (params.liftForce -= 1);
      params.Beta = params.Beta === 110 ? params.Beta : params.Beta + 1;
    } else params.Beta = params.Beta === 90 ? params.Beta : params.Beta + 1;
  }
  if (event.code === "KeyS" && person.isPersonJumped) {
    if (person.isParachuteOpened) {
      params.liftForce === 30 ? params.liftForce : (params.liftForce += 1);
      params.Beta = params.Beta <= 70 ? params.Beta : params.Beta - 1;
    } else {
      params.Beta = params.Beta <= 1 ? params.Beta : params.Beta - 1;
    }
  }
  if (event.code === "KeyR" && person.isDead) {
    window.location.reload();
  }
});

// here we add any function for moving in the end we separate them
export function setMovingCameraPosition() {
  if (plane.plane && !person.isPersonJumped) {
    controls.target.copy(plane.plane.position);
  }
}
// for moving the airplane
function animatePlane() {
  if (!plane.plane) return;
  const elapsedTime = clock.getElapsedTime();
  plane.plane.position.x += 0.1;
  plane.plane.position.y = Math.sin(elapsedTime);
}
// this is just for test -----------------
function humanFall() {
  if (person.isPersonJumped && !person.isParachuteOpened) {
    (person.person.position.y = -position.y),
      (person.person.position.z = -position.z);
    (person.person.position.x = -position.x),
      controls.target.copy(person.person.position);
  }
  if (person.isParachuteOpened) {
    const newParachutePosition = new THREE.Vector3();
    controls.target.copy(person.person.position);

    (person.person.position.y = -position.y),
      (person.person.position.z = -position.z);
    (person.person.position.x = -position.x),
      newParachutePosition.copy(person.person.position);
    // this for correcting parachute position -------
    newParachutePosition.x += 3.6;
    newParachutePosition.y += 2.8;
    newParachutePosition.z -= 2.8;
    // ----------------------------------------------
    person.parachute.position.copy(newParachutePosition);
  }
}

function calculations() {
  // if the person isn't jumped yet don't do anyThing
  if (!person.isPersonJumped) return;

  // death condition
  if (velocity.y > 15 && person.person.position.y < GROUND_HEIGHT + 3) {
    videoPlane.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z - 4
    );

    // disabling the death message
    videoPlane.scale.x = 2;
    videoPlane.scale.y = 2;
    videoPlane.scale.z = 2;
    env.removeGround();
    camera.lookAt(videoPlane.position);
    updateInfoText("");
    video.play();
    person.die();
    updateInfoText(`press "R" to Reload `);
  }

  // stop condition
  if (person.person.position.y < GROUND_HEIGHT) {
    if (person.isParachuteOpened) person.closeParachute();
    // stop
    return;
  }

  if (!person.isParachuteOpened) {
    // Before open the parachute
    person.person.rotation.x = degToRadian(params.Beta);
    person.person.rotation.y = degToRadian(params.alpha);
    calculateDragForce(
      params.Cd,
      params.PersonA,
      params.airDensity,
      velocity,
      dragForce,
      params.alpha,
      params.Beta
    );
    Calculate_Current_Acceleration(
      params.mass,
      g,
      params.airDensity,
      params.Cd,
      params.Cl,
      params.PersonA,
      person.isParachuteOpened,
      velocity,
      dragForce,
      params.alpha,
      params.Beta,
      params.liftForce / 10,
      acceleration
    );
    Calculate_Current_Velocity(acceleration, velocity);
  } else {
    // After Open the parachute
    person.parachute.rotation.z = degToRadian(params.Beta + 90);
    person.person.rotation.x = degToRadian(0);
    calculateDragForce(
      params.Cl + params.Cd,
      params.ParachuteA,
      params.airDensity,
      velocity,
      dragForce,
      params.alpha,
      params.Beta
    );
    Calculate_Current_Acceleration(
      params.mass,
      g,
      params.airDensity,
      params.Cd,
      params.Cl,
      params.ParachuteA,
      person.isParachuteOpened,
      velocity,
      dragForce,
      params.alpha,
      params.Beta,
      params.liftForce / 10,
      acceleration
    );
    Calculate_Current_Velocity(acceleration, velocity);
  }

  CalculateCurrentPosition(position, velocity);

  t += 0.01;
  // update debug values
  updateAccelerationText(
    acceleration.length(),
    acceleration.x,
    acceleration.y,
    acceleration.z
  );
  updateVelocityText(velocity.length(), velocity.x, velocity.y, velocity.z);
  updateDragForceText(
    dragForce.length(),
    dragForce.x,
    dragForce.y,
    dragForce.z
  );
  updateJumpTimeText(t);
  updateAngelHorizenText(params.Beta);
  // updateAngelVerticalText(params.alpha);
}
// -------------------------------------------------------
// main function runs every frame
MainAnimationLoop(
  calculations,
  animatePlane,
  setMovingCameraPosition,
  humanFall
);
