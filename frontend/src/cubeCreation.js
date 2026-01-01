import * as THREE from 'three'
import * as Constants from './constants.js'
import { scene, cubeViewGroup  } from './scene.js'

export const cubeMatrix = []
export const cubelets = []

const geometry = new THREE.BoxGeometry(Constants.boxWidth, Constants.boxHeight, Constants.boxDepth)

function orientFace(mesh, face, offset) {
    switch (face) {
        case "F":
            mesh.position.z = offset;
            break;

        case "B":
            mesh.position.z = -offset;
            mesh.rotation.y = Math.PI;
            break;

        case "R":
            mesh.position.x = offset;
            mesh.rotation.y = -Math.PI / 2;
            break;

        case "L":
            mesh.position.x = -offset;
            mesh.rotation.y = Math.PI / 2;
            break;

        case "U":
            mesh.position.y = offset;
            mesh.rotation.x = -Math.PI / 2;
            break;

        case "D":
            mesh.position.y = -offset;
            mesh.rotation.x = Math.PI / 2;
            break;
    }
}

function addSticker(cube, face) {
    const border = new THREE.Mesh(
        new THREE.PlaneGeometry(Constants.BORDER_SIZE, Constants.BORDER_SIZE),
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
    )

    const sticker = new THREE.Mesh(
        new THREE.PlaneGeometry(Constants.STICKER_SIZE, Constants.STICKER_SIZE),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    )

    cube.add(border)
    cube.add(sticker)

    orientFace(border, face, Constants.BORDER_OFFSET)
    orientFace(sticker, face, Constants.STICKER_OFFSET)

    sticker.userData = { face, id: `${face}_sticker`, color: 'W' }
}

function addStickersPerFace(cube, coordinates) {
    if (coordinates[0] == 0) addSticker(cube, "L")
    if (coordinates[0] == 2) addSticker(cube, "R")
    if (coordinates[1] == 0) addSticker(cube, "D")
    if (coordinates[1] == 2) addSticker(cube, "U")
    if (coordinates[2] == 0) addSticker(cube, "B")
    if (coordinates[2] == 2) addSticker(cube, "F")
}

function createCube(geometry, cubeColor, cubeCoordinates, arrayCoordinates) {
    const material = new THREE.MeshBasicMaterial({ color: cubeColor })
    const cube = new THREE.Mesh(geometry, material)

    cubeViewGroup.add(cube)
    cube.position.set(...cubeCoordinates)

    addStickersPerFace(cube, arrayCoordinates)
    return cube
}

export function createCubeMatrix(dimensionX, dimensionY, dimensionZ) {
    for (let x = 0; x < dimensionX; x++) {
        cubeMatrix[x] = []
        for (let y = 0; y < dimensionY; y++) {
            cubeMatrix[x][y] = []
            for (let z = 0; z < dimensionZ; z++) {
                if (x == 1 && y == 1 && z == 1) continue

                const cubeCoordinates = [
                    (x - 1) * Constants.spacing,
                    (y - 1) * Constants.spacing,
                    (z - 1) * Constants.spacing
                ]

                const cube = createCube(
                    geometry,
                    Constants.defaultColor,
                    cubeCoordinates,
                    [x, y, z]
                )

                cube.userData = { x, y, z }
                cubeMatrix[x][y][z] = cube
                cubelets.push(cube)
            }
        }
    }
}
