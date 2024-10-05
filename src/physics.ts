//gravity calculation

import * as THREE from "three";
import { Vector3 } from "three";
import { degToRadian } from "./utilities/helpers";

export function calculateGravity(mass: number, g: number): number {
  return mass * g;
}
export function calculateDragForce(
  Cd: number,
  A: number,
  airDensity: number,
  velocity: THREE.Vector3,
  dragForce: THREE.Vector3,
  alpha: number,
  beta: number
): void {
  dragForce.x =
    0.5 *
    Cd *
    A *
    airDensity *
    velocity.x *
    velocity.x *
    Math.cos(degToRadian(alpha));
  dragForce.y =
    0.5 *
    Cd *
    A *
    airDensity *
    velocity.y *
    velocity.y *
    Math.sin(degToRadian(beta));
  dragForce.z =
    0.5 *
    Cd *
    A *
    airDensity *
    velocity.z *
    velocity.z *
    Math.sin(degToRadian(alpha)) *
    Math.cos(degToRadian(beta));
}

export function calculate_Initial_Values(
  mass: number,
  g: number,
  VJump: number,
  VPlane: number,
  alpha: number,
  A: number,
  Cd: number,
  airDensity: number,
  initialVelocity: Vector3,
  dragForce: Vector3,
  acceleration: Vector3,
  beta: number
) {
  initialVelocity.x = VJump;
  initialVelocity.z = VPlane * Math.cos(alpha);
  calculateDragForce(
    Cd,
    A,
    airDensity,
    initialVelocity,
    dragForce,
    alpha,
    beta
  );

  acceleration.x = dragForce.x / mass;
  acceleration.y = -g;
  acceleration.z = 0;
}
export function CalculateWindEffect(
  v: Vector3,
  windVelocity: number,
  alpha: number,
  beta: number,
  fr: Vector3,
  airDensity: number,
  A: number,
  Cd: number
) {
  // if (isFirstTerminal || isSecondTerminal) return;
  // v.setLength(
  //   Math.sqrt(
  //     Math.pow(v.length(), 2) +
  //       Math.pow(windVelocity, 2) -
  //       2 * windVelocity * v.length() * Math.cos(alpha - beta)
  //   )
  // );
  const windForce = new THREE.Vector3();
  const windForceLength =
    0.5 * Cd * A * airDensity * windVelocity * windVelocity;
  windForce.set(
    0 * Math.cos(degToRadian(80)),
    windForceLength * Math.sin(degToRadian(10)),
    0 * Math.cos(degToRadian(80)) * Math.sin(degToRadian(10))
  );

  console.log(
    "windForce *****************************************************************************",
    windForce
  );
  fr.set(fr.x + windForce.x, fr.y + windForce.y, fr.z + windForce.z);
}
export function Calculate_Current_Acceleration(
  m: number,
  g: number,
  airDensity: number,
  Cd: number,
  CL: number,
  A: number,
  isParachuteOpen: boolean,
  v: Vector3,
  fr: Vector3,
  alpha: number,
  beta: number,
  robLiftForce: number,

  acceleration: Vector3
): void {
  const fg = m * g;

  if (isParachuteOpen) {
    const vx2 = v.x * v.x;
    const vy2 = v.y * v.y;
    const vz2 = v.z * v.z;
    acceleration.set(
      -(
        airDensity *
        A *
        vx2 *
        (Cd + CL) *
        robLiftForce *
        Math.cos(degToRadian(alpha))
      ) /
        (2 * m),
      g -
        (airDensity *
          A *
          vy2 *
          (Cd + CL) *
          robLiftForce *
          Math.sin(degToRadian(beta))) /
          (2 * m),
      -(
        airDensity *
        A *
        vz2 *
        robLiftForce *
        (Cd + CL) *
        Math.sin(degToRadian(alpha)) *
        Math.cos(degToRadian(beta))
      ) /
        (2 * m)
    );
  } else acceleration.set(-fr.x / m, (fg - fr.y) / m, -fr.z / m);
}

export function Calculate_Current_Velocity(
  a: THREE.Vector3,

  v: THREE.Vector3
): void {
  v.set(v.x + a.x * 0.01, v.y + a.y * 0.01, v.z + a.z * 0.01);
}

export function CalculateCurrentPosition(
  position: THREE.Vector3,
  v: THREE.Vector3
): void {
  position.x = position.x + v.x * 0.01;
  position.y = position.y + v.y * 0.01;
  position.z = position.z + v.z * 0.01;
}
