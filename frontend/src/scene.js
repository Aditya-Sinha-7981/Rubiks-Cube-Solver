import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as constants from './constants.js'

export const scene = new THREE.Scene()

export const camera = new THREE.PerspectiveCamera(40, constants.WIDTH / constants.HEIGHT, 0.1, 1000)

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
})

renderer.setSize(constants.WIDTH, constants.HEIGHT)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(constants.BACKGROUND_COLOR, constants.BACKGROUND_ALPHA)
constants.CUBE_CONTAINER.appendChild(renderer.domElement)

camera.position.set(6, 4.5, 6)
camera.lookAt(0, 0, 0)

export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enableRotate = false
controls.enablePan = false

export const cubeViewGroup = new THREE.Group()
scene.add(cubeViewGroup)

function resizeRenderer() {
  const w = constants.CUBE_CONTAINER.clientWidth
  const h = constants.CUBE_CONTAINER.clientHeight

  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

constants.fullScreenButton.onclick = () => {
  constants.CUBE_CONTAINER.classList.toggle('fullscreen')

  resizeRenderer()
}
function applyCameraPreset(mode) {
  const preset = CAMERA_PRESETS[mode]

  camera.fov = preset.fov
  camera.position.set(...preset.position)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
}
