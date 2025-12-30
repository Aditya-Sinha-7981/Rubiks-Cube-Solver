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
controls.enableRotate = true
controls.enablePan = false

const radius = 6;

function updateCamera() {
  const yawRad = THREE.MathUtils.degToRad(cameraState.yaw)
  const pitchRad = THREE.MathUtils.degToRad(cameraState.pitch)

  camera.position.x = radius * Math.cos(pitchRad) * Math.sin(yawRad)
  camera.position.y = radius * Math.sin(pitchRad)
  camera.position.z = radius * Math.cos(pitchRad) * Math.cos(yawRad)

  camera.lookAt(0, 0, 0)
}




controls.update()
