import * as THREE from 'three'

export function vectorUtils() {
  function projectVectorToScreen(vector, camera) {
    const projected = vector.clone().project(camera)
    return new THREE.Vector2(projected.x, projected.y)
  }

  function getLocalVectors(face, camera) {
    // Create a bounding box around the face and calculate its size
    const box = new THREE.Box3().setFromObject(face)
    const size = new THREE.Vector3()
    let boxWidth, boxHeight
    box.getSize(size)

    let faceName = face.name.split('_')[1]
    let localRightVector, localUpVector
    // Determine the width and height of the face based on its orientation
    if (faceName == 'front' || faceName == 'back') {
      boxWidth = size.x
      boxHeight = size.y
    } else if (faceName == 'left' || faceName == 'right') {
      boxWidth = size.z
      boxHeight = size.y
    } else if (faceName == 'up' || faceName == 'down') {
      boxWidth = size.x
      boxHeight = size.z
    }

    // Define the right and up vectors in local space
    localRightVector = {
      start: new THREE.Vector3(-boxWidth / 2, 0, 0),
      end: new THREE.Vector3(boxWidth / 2, 0, 0),
    }

    localUpVector = {
      end: new THREE.Vector3(0, boxHeight / 2, 0),
      start: new THREE.Vector3(0, -boxHeight / 2, 0),
    }

    normalizeFaceVectors(faceName, localRightVector, localUpVector)
    // Convert local vectors to world positions
    const rightStartWorld = face.localToWorld(localRightVector.start.clone())
    const rightEndWorld = face.localToWorld(localRightVector.end.clone())

    const rightVector = projectVectorToScreen(rightEndWorld, camera).sub(
      projectVectorToScreen(rightStartWorld, camera)
    )

    const upStartWorld = face.localToWorld(localUpVector.start.clone())
    const upEndWorld = face.localToWorld(localUpVector.end.clone())

    const upVector = projectVectorToScreen(upEndWorld, camera).sub(
      projectVectorToScreen(upStartWorld, camera)
    )

    return { rightVector, upVector }
  }

  function normalizeFaceVectors(faceName, localRightVector, localUpVector) {
    const inversionRules = {
      down: ['right'],
      left: ['up'],
      front: ['up'],
      up: ['right', 'up'],
    }

    const rules = inversionRules[faceName] || []
    if (rules.includes('right')) {
      ;[localRightVector.start, localRightVector.end] = [
        localRightVector.end,
        localRightVector.start,
      ]
    }
    if (rules.includes('up')) {
      ;[localUpVector.start, localUpVector.end] = [
        localUpVector.end,
        localUpVector.start,
      ]
    }
  }

  function determineDragDirection(
    mouse,
    horizontalMove,
    verticalMove,
    rightVector,
    upVector
  ) {
    let mouseVector = mouse
    const mouseVectorNormalized = mouseVector.clone().normalize()
    const screenRightVectorNormalized = rightVector.clone().normalize()
    const screenUpVectorNormalized = upVector.clone().normalize()

    // Calculate dot products
    const dotRight = mouseVectorNormalized.dot(screenRightVectorNormalized)
    const dotUp = mouseVectorNormalized.dot(screenUpVectorNormalized)

    // Determine direction and similarity
    let moveSelected = { name: '', reverse: false }
    if (Math.abs(dotRight) > Math.abs(dotUp)) {
      moveSelected.name = horizontalMove // selector_X
      moveSelected.reverse = dotRight > 0 ? false : true // right : left
    } else {
      moveSelected.name = verticalMove // selector_X
      moveSelected.reverse = dotUp > 0 ? false : true // up : down
    }
    return moveSelected
  }
  return {
    getLocalVectors,
    determineDragDirection,
  }
}
