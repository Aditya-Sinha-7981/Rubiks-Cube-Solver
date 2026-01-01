import * as THREE from 'three'
import Swal from 'sweetalert2'
import * as constants from './constants.js'
import { renderer, scene, camera, controls, cubeViewGroup } from './scene.js'
import * as cubeCreation from './cubeCreation.js'
import * as cubeMovement from './cubeMovement.js'
import { debugTrackedCubelet, setTrackedCubelet, colorFrontSticker, debugCubeGroup  } from './debug.js'

cubeCreation.createCubeMatrix(3, 3, 3)

setTrackedCubelet(0, 2, 2)

const testCubelet = cubeCreation.cubeMatrix[0][2][2]
colorFrontSticker(testCubelet, 0xff0000)

// Layer rotation functions
window.addEventListener('keydown', (event) => {
    if (!cubeMovement.currentMove){
        if (event.key.toLowerCase() === 'u'){
            cubeMovement.moveLayer('y', 2, -1) //-90
        }else if(event.key.toLowerCase() === 'd'){
            cubeMovement.moveLayer('y', 0, 1) //+90
        }else if(event.key.toLowerCase() === 'l'){
            cubeMovement.moveLayer('x', 0, 1) 
        }else if(event.key.toLowerCase() === 'r'){
            cubeMovement.moveLayer('x', 2, -1)
        }else if(event.key.toLowerCase() === 'f'){
            cubeMovement.moveLayer('z', 2, -1)
        }else if(event.key.toLowerCase() === 'b'){
            cubeMovement.moveLayer('z', 0, 1)
        }
    }
    debugTrackedCubelet("BEFORE MOVE");
})

// Cube Rotation functions 
constants.ROTATE_LEFT.onclick = () => {
    cubeMovement.rotateCube('y', -1)
}
constants.ROTATE_RIGHT.onclick = () => {
    cubeMovement.rotateCube('y', 1)
}
constants.ROTATE_UP.onclick = () => {
    cubeMovement.rotateCube('x', -1)
}
constants.ROTATION_RESET.onclick = () => {
    // cubeMovement.cubeRotationReset()
    Swal.fire({
        title: 'Reset Cube Rotation?',
        text: `This will reset the cube to it's original orientation.`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if(result.isConfirmed){
            cubeMovement.cubeRotationReset()
        }
    })
}
  

function animate() {
    //Layer movement animation
    if (cubeMovement.currentMove) {
        const step = Math.min(cubeMovement.currentMove.remaining, cubeMovement.currentMove.speed)
        cubeMovement.currentMove.group.rotation[cubeMovement.currentMove.axis] += step * cubeMovement.currentMove.rotationSign
        cubeMovement.currentMove.remaining -= step

        if (cubeMovement.currentMove.remaining <= 0) {
            cubeMovement.finalizeMove()
            cubeMovement.applyLogicalMove(cubeMovement.currentMove)
            cubeMovement.syncPositionsFromLogic()
            debugTrackedCubelet("AFTER MOVE")
            cubeMovement.clearCurrentMove()
        }
    }

    //Cube rotation animation
    if(cubeMovement.cubeRotation) {
        const step = Math.min(cubeMovement.cubeRotation.remaining, cubeMovement.cubeRotation.speed)
        cubeViewGroup.rotation[cubeMovement.cubeRotation.axis] += step * cubeMovement.cubeRotation.sign 
        cubeMovement.cubeRotation.remaining -= step

        if (cubeMovement.cubeRotation.remaining <= 0) {
            cubeMovement.snapCubeViewRotation()
            cubeMovement.clearCubeRotation()
            debugCubeGroup()
        }
    }

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
