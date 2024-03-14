import * as THREE from "three"

let pos = new THREE.Vector2()

export function normaliseCoordinates(x,y, width, height){
    const lL = window.innerWidth / 2 - width / 2
    const hL = window.innerWidth / 2 + width / 2

    const lL_y = 0
    const hL_y = height


    if (x >= lL && x <= hL) {
        const posX = x - lL;
  
        pos.x = (posX / 1150) * 2 - 1;
      } else {
        pos.x = pos.x < 0 ? -1 : 1;
      }
  
      if (y >= lL_y && y <= hL_y) {
        const posY = y - lL_y;
  
        pos.y = -(posY / 600) * 2 + 1;
      } else {
        pos.y = pos.y < 0 ? -1 : 1;
      }

      return pos
}