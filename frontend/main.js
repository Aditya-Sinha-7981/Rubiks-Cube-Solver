import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { color } from 'three/tsl';

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const boxHeight = 1
const boxWidth = 1
const boxDepth = 1
const defaultColor = 0xffffff
const spacing = 1;
const BORDER_OFFSET = 0.501;
const STICKER_OFFSET = 0.502;
const BORDER_SIZE = 1.01;
const STICKER_SIZE = 0.9;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 0.1, 1000 );
// const renderer = new THREE.WebGLRenderer();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize( WIDTH, HEIGHT );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild( renderer.domElement );
camera.position.set(6, 4.5, 6);
camera.lookAt(0, 0, 0);

const cubeMatrix = [];
const cubelets = [];
let currentMove = null

const FACE_ROTATION = {
    x: {
        "-1":  { U: 'B', B: 'D', D: 'F', F: 'U' }, //R
        "1": { U: 'F', F: 'D', D: 'B', B: 'U' } //L
    },
    y: {
        "1":  { F: 'R', R: 'B', B: 'L', L: 'F' }, //D
        "-1": { F: 'L', L: 'B', B: 'R', R: 'F' } //U
    },
    z: {
        "1":  { U: 'L', L: 'D', D: 'R', R: 'U' }, //B
        "-1": { U: 'R', R: 'D', D: 'L', L: 'U' } //F
    }
};

// TESTING CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

function createCube(geometry, cubeColor, cubeCoordinates, arrayCoordinates){
    // Add cubelet
    const material = new THREE.MeshBasicMaterial( { color: cubeColor } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.set(cubeCoordinates[0], cubeCoordinates[1], cubeCoordinates[2])

    addStickersPerFace(cube, arrayCoordinates)

    return cube;
}


function addStickersPerFace(cube, coordinates){
    if(coordinates[0] == 0){
        addSticker(cube, "L")
    }
    if(coordinates[0] == 2){
        addSticker(cube, "R")
    }
    if(coordinates[1] == 0){
        addSticker(cube, "D")
    }
    if(coordinates[1] == 2){
        addSticker(cube, "U")
    }
    if(coordinates[2] == 0){
        addSticker(cube, "B")
    }
    if(coordinates[2] == 2){
        addSticker(cube, "F")
    }
}

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
    const border = new THREE.Mesh(new THREE.PlaneGeometry(BORDER_SIZE, BORDER_SIZE), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }));
    const sticker = new THREE.Mesh(new THREE.PlaneGeometry(STICKER_SIZE, STICKER_SIZE), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));

    cube.add(border);
    cube.add(sticker);

    orientFace(border, face, BORDER_OFFSET);
    orientFace(sticker, face, STICKER_OFFSET);

    sticker.userData = {face, id: `${face}_sticker`, color: 0xffffff};
}


function createCubeMatrix(dimensionX, dimensionY, dimensionZ){
    for(let x = 0; x < dimensionX; x++){
        cubeMatrix[x] = []
        for(let y = 0; y < dimensionY; y++){
            cubeMatrix[x][y] = []
            for(let z = 0; z < dimensionZ; z++){
                if(x == 1 && y == 1 && z == 1){
                    continue
                }
                const xPosition = (x - (dimensionX - 1) / 2) * spacing;
                const zPosition = (z - (dimensionZ - 1) / 2) * spacing;
                const yPosition = (y - (dimensionY - 1) / 2) * spacing;
                const cubeCoordinates = [xPosition, yPosition, zPosition] //-1, 0, 1
                const arrayCoordinates = [x, y, z] //0, 1, 2
                const cube = createCube(geometry, defaultColor, cubeCoordinates, arrayCoordinates);
                cubeMatrix[x][y][z] = cube
                cube.userData = {x, y, z}
                cubelets.push(cube)
            }
        }
    }
}

createCubeMatrix(3,3,3)
// console.log(cubeMatrix)
// console.log(cubelets)

const trackedCubelet = cubeMatrix[1][2][2];


// TEST CUBE
const testCubelet = cubeMatrix[0][2][2];
function colorFrontSticker(cubelet, color) {
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
colorFrontSticker(testCubelet, 0xff0000); // red


// CUBE MOVEMENT

function moveLayer(cubelets, axis, value, direction){
    const tempGroup = new THREE.Group()
    cubelets.forEach(cube => {
        if(cube.userData[axis] == value){
            tempGroup.add(cube)
        }
    });
    scene.add(tempGroup);

    currentMove = {group: tempGroup, axis: axis, remaining: Math.PI / 2, speed: 0.05, rotationSign: direction, axisValue: value}
}

window.addEventListener('keydown', (event) => {
    if (!currentMove){
        if (event.key.toLowerCase() === 'u'){
            moveLayer(cubelets, 'y', 2, -1) //-90
        }else if(event.key.toLowerCase() === 'd'){
            moveLayer(cubelets, 'y', 0, 1) //+90
        }else if(event.key.toLowerCase() === 'l'){
            moveLayer(cubelets, 'x', 0, 1) 
        }else if(event.key.toLowerCase() === 'r'){
            moveLayer(cubelets, 'x', 2, -1)
        }else if(event.key.toLowerCase() === 'f'){
            moveLayer(cubelets, 'z', 2, -1)
        }else if(event.key.toLowerCase() === 'b'){
            moveLayer(cubelets, 'z', 0, 1)
        }
    }
    debugTrackedCubelet("BEFORE MOVE");
})

function applyLogicalMove(move) {
    const { axis, axisValue, rotationSign } = move;
    const updates = [];

    // STEP 1: READ + COMPUTE
    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            for (let z = 0; z <= 2; z++) {
                const cube = cubeMatrix[x][y][z];
                if (!cube) continue;
                if (cube.userData[axis] !== axisValue) continue;

                let newX = x;
                let newY = y;
                let newZ = z;

                // U / D (rotate X-Z plane)
                if (axis === 'y') {
                    if (rotationSign > 0) {
                        newX = z;
                        newZ = 2 - x;
                    } else {
                        newX = 2 - z;
                        newZ = x;
                    }
                }

                // L / R (rotate Y-Z plane)
                else if (axis === 'x') {
                    if (rotationSign < 0) {
                        newY = z;
                        newZ = 2 - y;
                    } else {
                        newY = 2 - z;
                        newZ = y;
                    }
                }

                // F / B (rotate X-Y plane)
                else if (axis === 'z') {
                    if (rotationSign < 0) {
                        newX = y;
                        newY = 2 - x;
                    } else {
                        newX = 2 - y;
                        newY = x;
                    }
                }

                updates.push({
                    cube,
                    oldX: x,
                    oldY: y,
                    oldZ: z,
                    newX,
                    newY,
                    newZ
                });
            }
        }
    }

    // STEP 2: CLEAR OLD POSITIONS
    updates.forEach(u => {
        cubeMatrix[u.oldX][u.oldY][u.oldZ] = null;
    });

    // STEP 3: WRITE NEW POSITIONS
    updates.forEach(u => {
        u.cube.userData.x = u.newX;
        u.cube.userData.y = u.newY;
        u.cube.userData.z = u.newZ;
        cubeMatrix[u.newX][u.newY][u.newZ] = u.cube;
    });
}

function updateStickerFaces(cube, axis, rotationSign) {
    cube.children.forEach(child => {
        if (!child.userData.face) return;

        const map = FACE_ROTATION[axis][rotationSign.toString()];
        if (map[child.userData.face]) {
            child.userData.face = map[child.userData.face];
        }
    });
}


function syncPositionsFromLogic() {
    for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 2; y++) {
            for (let z = 0; z <= 2; z++) {
                const cube = cubeMatrix[x][y][z];
                if (!cube) continue;

                cube.position.set(
                    x - 1,
                    y - 1,
                    z - 1
                );
            }
        }
    }
}

function debugTrackedCubelet(label = "") {
    const cube = trackedCubelet;
    if (!cube) {
        console.warn("Tracked cubelet missing");
        return;
    }

    const worldPos = new THREE.Vector3();
    cube.getWorldPosition(worldPos);

    console.group(`🧊 DEBUG CUBELET ${label}`);

    console.log("Logical position (userData):", {
        x: cube.userData.x,
        y: cube.userData.y,
        z: cube.userData.z
    });

    console.log("World position:", worldPos);
    console.log("Cube rotation (radians):", {
        x: cube.rotation.x,
        y: cube.rotation.y,
        z: cube.rotation.z
    });

    console.log("Stickers:");

    cube.children.forEach(child => {
        if (!child.userData.face) return;

        const stickerWorldPos = new THREE.Vector3();
        child.getWorldPosition(stickerWorldPos);

        console.log({
            stickerId: child.userData.id,
            logicalFace: child.userData.face,
            localPosition: {
                x: child.position.x,
                y: child.position.y,
                z: child.position.z
            },
            worldPosition: stickerWorldPos,
            rotation: {
                x: child.rotation.x,
                y: child.rotation.y,
                z: child.rotation.z
            },
            color: child.userData.color
        });
    });

    console.groupEnd();
}



function finalizeMove() {
    if (!currentMove) return;
    const rotatedCubes = [...currentMove.group.children];

    rotatedCubes.forEach(cube => {
        scene.attach(cube);
        updateStickerFaces(cube, currentMove.axis, currentMove.rotationSign);
    });

    scene.remove(currentMove.group);
    console.log("Move finalized");
}


function animate() {
    controls.update();
    if(currentMove){
        const step = Math.min(currentMove.remaining, currentMove.speed)
        console.log(`${step}`)
        currentMove.group.rotation[currentMove.axis] += step * currentMove.rotationSign
        currentMove.remaining -= step
        if(currentMove.remaining <= 0){
            finalizeMove();
            applyLogicalMove(currentMove);
            syncPositionsFromLogic();
            debugTrackedCubelet("AFTER MOVE");
            currentMove = null;
        }
    }
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );