# Cube Creation 

* We firstly create a cube matrix which will be 3x3x3, each element of the matrix will contain a cubelet
* A cubelet is a 3D cube mesh generated via three.js, a Rubik's cube will have 26 cubelets(cubelete at position 1,1,1 is never seen so not rendered)
* Each cubelet will have stickers on top of it which will determine the color 
* Depending on the position of cubelet, we will have different stickers: 
    * Center(1 sticker): Any two axes will be 1 and last axis 0 OR 2
    * Edge(2 sticker): Any one axes will be 1 and remaining axes can be 0 or 2
    * Corner(3 sticker): All axes will have either 0 or 2
* Next big step is to add "Stickers Per Face" 

---

## Stickers Per Face

* First determine the number and orientation of faces for each cubelet
    * (x == 0): It will have a left face
    * (x == 0): It will have a right face
    * (y == 0): It will have a down face
    * (y == 2): It will have a up face
    * (z == 0): It will have a bottom face
    * (z == 2): It will have a front face
* After determining the face, add sticker(plane with size smaller than cubelet) and border(plane with size bigger than cubelet)

## Adding Stickers and Border

* Create Sticker and Border of appropriate size and make sure they are double planed(usually they are created with front plane only but we need both planes for some faces like "Right")
* Stickers must overlap with each others to give a concrete border look
* Add the sticker and border to the face
* Three.js uses radian degrees for rotation hence the MATH.PI(180 deg)
* Y-axis is used as default for rotating around
* Orient the sticker and border depending on the face(by default objects are created facing +Z axis)
    * Front: No rotation needed()
    * Back: A 180deg on Y axis flips +Z to -Z
    * Left: +90 deg Y axis rotation
    * Right: -90 deg Y axis rotation
    * Top: Tilt it by -90deg on X axis
    * Down: Tilt it by +90 deg on X axis
