import * as THREE from 'three'
import * as constants from './constants.js'
import { renderer, camera, cubeViewGroup } from './scene.js'

let currentColor = 'W' //will change, default is white
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

constants.colorButtonRed.onclick = (e) => setCurrentColor('R', e.target)
constants.colorButtonWhite.onclick = (e) => setCurrentColor('W', e.target)
constants.colorButtonBlue.onclick = (e) => setCurrentColor('B', e.target)
constants.colorButtonOrange.onclick = (e) => setCurrentColor('O', e.target)
constants.colorButtonGreen.onclick = (e) => setCurrentColor('G', e.target)
constants.colorButtonYellow.onclick = (e) => setCurrentColor('Y', e.target)

export function setCurrentColor(colorLetter, targetButton) {
    currentColor = colorLetter
    const currentActive = document.querySelector('.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    if (targetButton) {
        targetButton.classList.add('active');
    }

}

export function getCurrentColor() {
    return currentColor
}

export function colorCurrentSticker(stickerMesh) {
    if (!stickerMesh?.userData?.face) return

    const hex = constants.COLOR_MAP[currentColor]

    stickerMesh.material.color.set(hex)
    stickerMesh.userData.color = currentColor

    console.log('🎨 Sticker colored:', {
        face: stickerMesh.userData.face,
        color: currentColor
    })
}



// --- event hookup ---
renderer.domElement.addEventListener('click', onCanvasClick)

function onCanvasClick(event) {
    const rect = renderer.domElement.getBoundingClientRect()

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(
        cubeViewGroup.children,
        true
    )

    if (intersects.length === 0) return

    const hit = intersects[0].object

    // Only care about stickers
    if (hit.userData && hit.userData.face) {
        colorCurrentSticker(hit)
    }
}
