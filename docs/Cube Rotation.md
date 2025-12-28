# Cube Rotation 

---

## Determining WHAT to move

* Create a temporay THREE group(creating a group of three.js is important as it can store multiple cubelets together)
* We DO NOT rotate a singular cube, for example, F annotation is "ANTI-CLOCKWISE" where 9 cubelets move so we group them together to effectively move/rotate them together AKA we rotate the entire layer
* In Rubik's cube, a rotation is always clockwise, **BUT** the face from which you are looking from changes with each annotation(you have to FACE the side you are turning)
    * Up: Looking from top, thus +Y axis
    * Down: Looking from down, thus -Y axis
    * Left: Looking from left, thus -X axis
    * Right: Looking from right, thus +X axis
    * Front: Looking from front, thus +Z axis
    * Back: Looking from back, thus -Z axis
* Determine the layer and axis by their coordinate value:
    * U: y == 2
    * D: y == 0
    * L: x == 0
    * R: x == 2
    * F: z == 2
    * B: z == 0

## Determining HOW to move

* After determining the cubelets to move, add them to the temporary group and create a layer
* Create a variable `currentMove` which will store necessary values such as
    * `group`: The layer of target cubelets we created
    * `axis`: The axis to move 
        * It is important to note that Rubik's cube notation and our maths differ because of normal axis
        * We do not change our view per annotation, instead we keep them same throughout notations 
    * `remaining`: 90deg rotation per move
    * `speed`: The number by which to increment/decrement rotation value
    * `rotationSign`: Further explained in rotation Math section


## Rotation Math

Since we do not change our normal axis in calculations as compared to Rubik's cube, we change how we rotate them, that is, Clockwise(-90 deg) or Anti-Clockwise(+90deg)

* During `currentMove`, we declare step and find minimum of the two values: 
    1. Remaining: 90 deg during start
    2. speed: 0.05 step increment/decrement
* We move the entire group/layer on one of the 3 axis, +X, +Y, +Z
* We multiply step with `rotationSign` which will be:
    * Negative: For -90 deg or clockwise rotation 
    * Positive: For +90 deg or anti-clockwise rotation
* We decrement the value of remaining degrees of rotation by step
* If the remaining value reaches 0, we have completed our rotation animation and we can stop
* **This is just for animation, the function `finalizeMove()` just animates, we still need to update actual indexes of cube logically**

## Logical Move Math

After a rotation is successfully animated, we have to release the cubes from group(so that multiple moves doesn't make the cube distorted) and place them at their current location(we have to calculate their current rotation in cube)

For example: A piece at 0,2,2 goes to 2,2,2 after a "Front" move

Thus we update the cubeMatrix after each move

* To determine logically which cubes moved, we need the fixes axis, value of the fixed axis and rotationSign(clockwise or anti-clockwise)
* Iterate over the `cubeMatrix`, find the affected cubes by axis and fixed axis
    * Based on rotation sign, we will have different formulas(take any piece and dry run with coordinates to find correct formula): 
        * <details><summary><b>Fixed axis = Y</b> (Rotate X-Z plane)</summary>
            ```javascript
            if (rotationSign > 0) {
                newX = z;
                newZ = 2 - x;
            } else {
                newX = 2 - z;
                newZ = x;
            }
            ```
            </details>
        * <details><summary><b>Fixed axis = X</b> (Rotate Y-Z plane)</summary>
            ```javascript
            if (rotationSign < 0) {
                newY = z;
                newZ = 2 - y;
            } else {
                newY = 2 - z;
                newZ = y;
            }
            ```
            </details>
        * <details><summary><b>Fixed axis = Z</b> (Rotate X-Y plane)</summary>
            ```javascript
            if (rotationSign < 0) {
                newX = y;
                newY = 2 - x;
            } else {
                newX = 2 - y;
                newY = x;
            }
            ```
            </details>
    * We updated new and old coordinates along with cube to an array 
    * We clear the cubes that were in the position of affected/moved cubes and then add new cubes based on new calculated index there
        * P.S: Do not read and delete/update at the same time, worst mistake ever
    * `syncPositionsFromLogic` just fixes the random small pointing errors that can cascade in multiple moves

## Update Sticker's face

After a move, say F, a sticker that was initially facing Up is now facing Right, we need to update these values after every animation is finished to make sure when we fetch the cubes and their stickers later, we get the correct ones

* Create an object based on values(just calculate them with a physical cube)
* After animation is finished, based on fixed axis and rotation sign, change the values or sticker's face 