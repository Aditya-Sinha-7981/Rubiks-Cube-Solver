import * as THREE from 'three'
import { scene } from './scene.js'
import * as cubeCreation from './cubeCreation.js'
import * as Constants from './constants.js'
import { debugTrackedCubelet } from './debug.js'

export let currentMove = null

export function clearCurrentMove() {
    currentMove = null //can't change it's value in another file otherwise
}

export function moveLayer(axis, value, direction) {
    const tempGroup = new THREE.Group()

    cubeCreation.cubelets.forEach(cube => {
        if (cube.userData[axis] == value) {
            tempGroup.add(cube)
        }
    })

    scene.add(tempGroup)

    currentMove = {
        group: tempGroup,
        axis,
        axisValue: value,
        rotationSign: direction,
        remaining: Math.PI / 2,
        speed: 0.05
    }
}

export function applyLogicalMove(move) {
    const { axis, axisValue, rotationSign } = move
    const updates = []

    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            for (let z = 0; z <= 2; z++) {
                const cube = cubeCreation.cubeMatrix[x][y][z]
                if (!cube) continue
                if (cube.userData[axis] !== axisValue) continue

                let newX = x, newY = y, newZ = z

                if (axis === 'y') {
                    if (rotationSign > 0) { newX = z; newZ = 2 - x }
                    else { newX = 2 - z; newZ = x }
                }
                else if (axis === 'x') {
                    if (rotationSign < 0) { newY = z; newZ = 2 - y }
                    else { newY = 2 - z; newZ = y }
                }
                else if (axis === 'z') {
                    if (rotationSign < 0) { newX = y; newY = 2 - x }
                    else { newX = 2 - y; newY = x }
                }

                updates.push({ cube, oldX: x, oldY: y, oldZ: z, newX, newY, newZ })
            }
        }
    }

    updates.forEach(u => cubeCreation.cubeMatrix[u.oldX][u.oldY][u.oldZ] = null)

    updates.forEach(u => {
        u.cube.userData.x = u.newX
        u.cube.userData.y = u.newY
        u.cube.userData.z = u.newZ
        cubeCreation.cubeMatrix[u.newX][u.newY][u.newZ] = u.cube
    })
}

export function updateStickerFaces(cube, axis, rotationSign) {
    cube.children.forEach(child => {
        if (!child.userData.face) return
        const map = Constants.FACE_ROTATION[axis][rotationSign.toString()]
        if (map[child.userData.face]) {
            child.userData.face = map[child.userData.face]
        }
    })
}

export function syncPositionsFromLogic() {
    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            for (let z = 0; z <= 2; z++) {
                const cube = cubeCreation.cubeMatrix[x][y][z]
                if (!cube) continue
                cube.position.set(x - 1, y - 1, z - 1)
            }
        }
    }
}

export function finalizeMove() {
    if (!currentMove) return

    const rotated = [...currentMove.group.children]

    rotated.forEach(cube => {
        scene.attach(cube)
        updateStickerFaces(cube, currentMove.axis, currentMove.rotationSign)
    })

    scene.remove(currentMove.group)
    console.log("Move finalized")
}
