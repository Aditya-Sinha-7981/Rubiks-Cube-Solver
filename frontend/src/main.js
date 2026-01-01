import * as THREE from 'three'
import Swal from 'sweetalert2'
import * as constants from './constants.js'
import { renderer, scene, camera, controls, cubeViewGroup } from './scene.js'
import * as cubeCreation from './cubeCreation.js'
import * as cubeMovement from './cubeMovement.js'
import './colorCube.js' //imported to gey raytracers
import { debugTrackedCubelet, setTrackedCubelet, colorFrontSticker, debugCubeGroup  } from './debug.js'

cubeCreation.createCubeMatrix(3, 3, 3)

// setTrackedCubelet(0, 2, 2)

// const testCubelet = cubeCreation.cubeMatrix[0][2][2]
// colorFrontSticker(testCubelet, 0xff0000)

// Layer rotation functions
window.addEventListener('keydown', (event) => {
    let currentKey = event.key.toLowerCase();
    if (!cubeMovement.currentMove) {
        switch (currentKey) {
            // Layer Moves (Letters)
            case 'u':
                cubeMovement.moveLayer('y', 2, -1);
                break;
            case 'd':
                cubeMovement.moveLayer('y', 0, 1);
                break;
            case 'l':
                cubeMovement.moveLayer('x', 0, 1);
                break;
            case 'r':
                cubeMovement.moveLayer('x', 2, -1);
                break;
            case 'f':
                cubeMovement.moveLayer('z', 2, -1);
                break;
            case 'b':
                cubeMovement.moveLayer('z', 0, 1);
                break;
        }
    }
    // debugTrackedCubelet("BEFORE MOVE");
})
// ------


// Cube Rotation Functions
window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    switch (event.key) {
        case 'ArrowLeft':
            cubeMovement.rotateCube('y', -1);
            break;
        case 'ArrowRight':
            cubeMovement.rotateCube('y', 1);
            break;
        case 'ArrowUp':
            cubeMovement.rotateCube('x', -1);
            break;
        case 'ArrowDown':
            cubeMovement.rotateCube('x', 1);
            break;
    }
});
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
    Swal.fire({
        title: 'Reset Cube Rotation?',
        text: `This will reset the cube to it's original orientation or completely if you choose "Completely".`,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Completely',
        denyButtonText: "Orientation",
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if(result.isConfirmed){
            cubeMovement.cubeRotationReset()
            cubeColorReset()
        }else if(result.isDenied){
            cubeMovement.cubeRotationReset()
        }
    })
}
// ------

// Cube Coloring functions
function cubeColorReset(){
    for(let i = 0; i <= 2; i++){
        for(let j = 0; j <= 2; j++){
            for(let k = 0; k <= 2; k++){
                if(cubeCreation.cubeMatrix[i][j][k] == null) continue;
    
                (cubeCreation.cubeMatrix[i][j][k].children).forEach((child) => {
                    if(child.geometry instanceof THREE.PlaneGeometry && child.userData.face){
                        child.material.color.set(0xffffff)
                        child.userData.color = 'W'
                    }
                });
            }
        }
    }
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
            // debugTrackedCubelet("AFTER MOVE")
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
            // debugCubeGroup()
        }
    }

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
