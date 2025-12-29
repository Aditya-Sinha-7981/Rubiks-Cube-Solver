import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { WIDTH, HEIGHT } from './constants.js'

export const scene = new THREE.Scene()

export const camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 1000)

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
})

renderer.setSize(WIDTH, HEIGHT)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

camera.position.set(6, 4.5, 6)
camera.lookAt(0, 0, 0)

export const controls = new OrbitControls(camera, renderer.domElement)
controls.update()
