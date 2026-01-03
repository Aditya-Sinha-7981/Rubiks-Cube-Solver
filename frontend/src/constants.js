export const CUBE_CONTAINER = document.querySelector('#cubeCanvas')
export const WIDTH = CUBE_CONTAINER.clientWidth
export const HEIGHT = CUBE_CONTAINER.clientHeight
export const BACKGROUND_COLOR = 0x000000
export const BACKGROUND_ALPHA = 0

// Camera Constants
export const ROTATE_LEFT = document.querySelector('#rotateLeft')
export const ROTATE_UP = document.querySelector('#rotateUp')
export const ROTATE_RIGHT = document.querySelector('#rotateRight')
export const ROTATION_RESET = document.querySelector('#rotationReset')
export const CAMERA_RADIUS = 8
export const CAMERA_ANIMATION_SPEED = 0.05

export const boxHeight = 1
export const boxWidth = 1
export const boxDepth = 1

export const defaultColor = 0xffffff
export const spacing = 1

export const BORDER_OFFSET = 0.501
export const STICKER_OFFSET = 0.502
export const BORDER_SIZE = 1.01
export const STICKER_SIZE = 0.9

export const FACE_ROTATION = {
    x: {
        "-1":  { U: 'B', B: 'D', D: 'F', F: 'U' },
        "1":   { U: 'F', F: 'D', D: 'B', B: 'U' }
    },
    y: {
        "1":   { F: 'R', R: 'B', B: 'L', L: 'F' },
        "-1":  { F: 'L', L: 'B', B: 'R', R: 'F' }
    },
    z: {
        "1":   { U: 'L', L: 'D', D: 'R', R: 'U' },
        "-1":  { U: 'R', R: 'D', D: 'L', L: 'U' }
    }
}

// Color Pickers

export const colorButtonRed = document.querySelector('#red-color')
export const colorButtonWhite = document.querySelector('#white-color')
export const colorButtonBlue = document.querySelector('#blue-color')
export const colorButtonOrange = document.querySelector('#orange-color')
export const colorButtonGreen = document.querySelector('#green-color')
export const colorButtonYellow = document.querySelector('#yellow-color')

export const COLOR_MAP = {
    W: 0xffffff,
    Y: 0xffdd00,
    R: 0xff0000,
    O: 0xff6d00,
    B: 0x3579de,
    G: 0x29bb2a
}

export const fullScreenButton = document.querySelector('#fullScreenButton')
export let viewMode = 'normal'
const CAMERA_PRESETS = {
    normal: {
      position: [6, 4.5, 6],
      fov: 40
    },
    fullscreen: {
      position: [4.5, 3.5, 4.5],
      fov: 35
    }
  }
  