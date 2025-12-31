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
