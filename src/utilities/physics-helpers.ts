import * as THREE from "three";

export function getTotalAcceleration(a: THREE.Vector3): number {
  return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
}
export function getTotalVelocity(v: THREE.Vector3): number {
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
}
