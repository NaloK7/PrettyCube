import { Vector2, Vector3 } from 'three'

/**
 * Utility functions for manipulating vectors in 3D space.
 */
export function vectorUtils() {
  /**
   * Converts a mouse event to normalized device coordinates (NDC).
   * @param {Event} event - The mouse event.
   * @param {DOMRect} containerRect - The bounding rectangle of the container.
   * @returns {Vector2} The normalized device coordinates.
   */
  function getMouseNDC(event, containerRect) {
    return new Vector2(
      ((event.clientX - containerRect.left) / containerRect.width) * 2 - 1,
      -((event.clientY - containerRect.top) / containerRect.height) * 2 + 1
    )
  }

  /**
   * Retrieves local vectors based on the camera's world matrix.
   * @param {Detector} detector - The detector object.
   * @returns {object} An object containing the right and up vectors.
   */
  function getLocalVectors(detector) {
    // Update the world matrix of the detector object
    detector.updateWorldMatrix(true, false)

    // Retrieve the world matrix
    const matrix = detector.matrixWorld

    // Extract the right vector by setting it from the first column of the matrix
    // The first column of the matrix typically contains the direction of the camera's right side
    const rightVector = new Vector3().setFromMatrixColumn(matrix, 0).normalize()

    // Extract the up vector by setting it from the second column of the matrix
    // The second column of the matrix typically contains the direction of the camera's up side
    const upVector = new Vector3().setFromMatrixColumn(matrix, 1).normalize()

    return { rightVector, upVector }
  }

  /**
   * Normalizes face vectors based on inversion rules.
   * @param {string} faceName - The name of the face.
   * @param {Vector3} rightVector - The right vector.
   * @param {Vector3} upVector - The up vector.
   * @returns {object} An object containing the normalized right and up vectors.
   */
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

  /**
   * Determines the drag direction based on the drag vector and movement vectors.
   * @param {Vector3} dragVector3D - The drag vector in 3D space.
   * @param {string} horizontalMoveSelector - The name of the horizontal move selector.
   * @param {string} verticalMoveSelector - The name of the vertical move selector.
   * @param {Vector3} rightVector - The right vector.
   * @param {Vector3} upVector - The up vector.
   * @returns {object} An object containing the move name and reverse flag.
   */
  function determineDragDirection(
    dragVector3D,
    horizontalMoveSelector,
    verticalMoveSelector,
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
      moveSelected.name = horizontalMoveSelector

      // same direction as rightVector ?
      moveSelected.reverse = dotRight < 0
    } else {
      moveSelected.name = verticalMoveSelector

      // same direction as upVector ?
      moveSelected.reverse = dotUp < 0
    }

    return moveSelected
  }

  return {
    getLocalVectors,
    determineDragDirection,
    normalizeFaceVectors,
    getMouseNDC,
  }
}
