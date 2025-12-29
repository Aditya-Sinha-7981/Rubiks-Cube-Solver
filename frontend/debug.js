import * as THREE from 'three'
import * as cubeCreation from './cubeCreation.js'

// export const trackedCubelet = cubeMatrix[0][2][2]
let trackedCubelet = null

export function setTrackedCubelet(x, y, z) {
    trackedCubelet = cubeCreation.cubeMatrix[x][y][z]
}

export function colorFrontSticker(cubelet, color) {
    cubelet.children.forEach(child => {
        if (
            child.geometry instanceof THREE.PlaneGeometry &&
            child.userData.face === "F"
        ) {
            child.material.color.set(color);
            child.userData.color = "red";
        }
    });
}

export function debugTrackedCubelet(label = "") {
    const cube = trackedCubelet
    if (!cube) {
        console.warn("Tracked cubelet missing")
        return
    }

    const worldPos = new THREE.Vector3()
    cube.getWorldPosition(worldPos)

    console.group(`🧊 DEBUG CUBELET ${label}`)

    console.log("Logical position:", cube.userData)
    console.log("World position:", worldPos)

    console.log("Stickers:")
    cube.children.forEach(child => {
        if (!child.userData.face) return
        const wp = new THREE.Vector3()
        child.getWorldPosition(wp)
        console.log({
            id: child.userData.id,
            face: child.userData.face,
            world: wp,
            color: child.userData.color
        })
    })

    console.groupEnd()
}
