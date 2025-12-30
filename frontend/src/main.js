import { renderer, scene, camera, controls } from './scene.js'
import * as cubeCreation from './cubeCreation.js'
import * as cubeMovement from './cubeMovement.js'
import { debugTrackedCubelet, setTrackedCubelet, colorFrontSticker  } from './debug.js'

cubeCreation.createCubeMatrix(3, 3, 3)

setTrackedCubelet(0, 2, 2)

const testCubelet = cubeCreation.cubeMatrix[0][2][2]
colorFrontSticker(testCubelet, 0xff0000)

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

function animate() {
    controls.update()

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

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
