const infoText = document.querySelector("#info-text"); //this for displaying instructions like the key to jump etc....
export function updateInfoText(newText: string) {
  if (infoText) infoText.innerHTML = newText;
}

const velocityDisplay = document.querySelector("#velocity");
export function updateVelocityText(
  newValue: number,
  newValueX: number,
  newValueY: number,
  newValueZ: number
) {
  if (velocityDisplay) {
    velocityDisplay.innerHTML = ` X:   ${newValueX.toFixed(4)}
    <br/>
    Y:   ${newValueY.toFixed(4)}
    <br/>
    Z:   ${newValueZ.toFixed(4)}
    <br/>
    Length:   ${newValue.toFixed(4)}`;
  }
}
const accelerationDisplay = document.querySelector("#acceleration");
export function updateAccelerationText(
  newValue: number,
  newValueX: number,
  newValueY: number,
  newValueZ: number
) {
  if (accelerationDisplay) {
    accelerationDisplay.innerHTML = `
  
    X:   ${newValueX.toFixed(4)}
    <br/>
    Y:   ${newValueY.toFixed(4)}
    <br/>
    Z:   ${newValueZ.toFixed(4)}
    <br/>
    Length:   ${newValue.toFixed(4)}
    
    `;
  }
}
const dragForceDisplay = document.querySelector("#drag-force");
export function updateDragForceText(
  newValue: number,
  newValueX: number,
  newValueY: number,
  newValueZ: number
) {
  if (dragForceDisplay) {
    dragForceDisplay.innerHTML = `
    X:   ${newValueX.toFixed(4)}
    <br/>
    Y:   ${newValueY.toFixed(4)}
    <br/>
    Z:   ${newValueZ.toFixed(4)}
    <br/>
    Length:   ${newValue.toFixed(4)}
    
    `;
  }
}
const jumpTimeDisplay = document.querySelector("#jump-time");
export function updateJumpTimeText(newValue: number) {
  if (jumpTimeDisplay) {
    jumpTimeDisplay.innerHTML = newValue.toFixed(2).toString();
  }
}
const angelHorizenDisplay = document.querySelector("#angel-horizen");
export function updateAngelHorizenText(newValue: number) {
  if (angelHorizenDisplay) {
    angelHorizenDisplay.innerHTML = newValue.toString();
  }
}
// const angelVerticalDisplay = document.querySelector("#angel-Vertical");
// export function updateAngelVerticalText(newValue: number) {
//   if (angelVerticalDisplay) {
//     angelVerticalDisplay.innerHTML = newValue.toString();
//   }
// }

export function degToRadian(deg: number) {
  return deg * (Math.PI / 180);
}
