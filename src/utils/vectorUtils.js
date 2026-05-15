import { Vector2, Vector3 } from 'three'

export function vectorUtils() {

  function getMouseNDC(event, containerRect) {
  return new Vector2(
    ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1,
    -((event.clientY - containerRect.top) / containerRect.height) * 2 + 1
  )
  }
  
  function getLocalVectors(detector) {
    detector.updateWorldMatrix(true, false)

    const matrix = detector.matrixWorld

    const rightVector = new Vector3()
      .setFromMatrixColumn(matrix, 0)
      .normalize()

    const upVector = new Vector3()
      .setFromMatrixColumn(matrix, 1)
      .normalize()
    
    return { rightVector, upVector }
  }

  function normalizeFaceVectors(faceName, rightVector, upVector) {
    const inversionRules = {
      down: ['right'],
      left: ['up'],
      front: ['up'],
      up: ['right', 'up'],
    }

    const rules = inversionRules[faceName] || []
    if (rules.includes('right')) {
       rightVector.negate()
    }
    if (rules.includes('up')) {
      upVector.negate()
    }
    return { rightVector, upVector }
  }

  function determineDragDirection(
    dragVector3D,
    horizontalMove,
    verticalMove,
    rightVector,
    upVector
  ) {
    const dragNormalized = dragVector3D.clone().normalize()

    const rightNormalized = rightVector.clone().normalize()
    const upNormalized = upVector.clone().normalize()

    // Dot products
    const dotRight = dragNormalized.dot(rightNormalized)
    const dotUp = dragNormalized.dot(upNormalized)

    let moveSelected = {
      name: '',
      reverse: false,
    }

    // Horizontal drag
    if (Math.abs(dotRight) > Math.abs(dotUp)) {
      moveSelected.name = horizontalMove

      // same direction as rightVector ?
      moveSelected.reverse = dotRight < 0
    } else {
      moveSelected.name = verticalMove

      // same direction as upVector ?
      moveSelected.reverse = dotUp < 0
    }

    return moveSelected
  }
  return {
    getLocalVectors,
    determineDragDirection,
    normalizeFaceVectors,
    getMouseNDC
  }
}
