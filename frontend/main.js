import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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

    sticker.userData = {face};
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
            }
        }
    }
}

createCubeMatrix(3,3,3)
console.log(cubeMatrix)

function animate() {
    controls.update();
    renderer.render( scene, camera );
    
    // cubes.forEach(cube => {
    //     cube.rotation.x += 0.01;
    // })
}
renderer.setAnimationLoop( animate );