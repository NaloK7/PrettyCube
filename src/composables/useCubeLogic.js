import * as THREE from 'three'

export function useCubeLogic(scene, rubiksCube, selectorGrp) {
  const history = []
  function selectRotationAxis(selectorName) {
    switch (selectorName.slice(-1)) {
      case 'L':
      case 'M':
      case 'R':
        return 'x'
      case 'U':
      case 'E':
      case 'D':
        return 'y'
      case 'F':
      case 'S':
      case 'B':
        return 'z'
      default:
        console.error('Invalid selector name:', selectorName)
        return
    }
  }

  // ROTATION
  /**
   * Retrieves all cubes from the Rubik's Cube scene that intersect with a specified selector.
   *
   * @param {string} selectorName - The name of the selector to check for intersections.
   * @returns {Array} An array of cube objects that intersect with the specified selector.
   *
   * Warns if the specified selector is not found.
   */
  function getCubesTouchingSelector(selectorName) {
    const selector = selectorGrp.children.filter(
      (child) => child.name === selectorName
    )[0]
    let selectedCubes = []

    if (!selector) {
      console.warn(`Can't find: ${selectorName}.`)
    } else {
      const selectorBox = new THREE.Box3().setFromObject(selector)

      rubiksCube.children.forEach((child) => {
        if (!child.name.startsWith('Cube')) return

        const cubeBox = new THREE.Box3().setFromObject(child)
        if (selectorBox.intersectsBox(cubeBox)) {
          selectedCubes.push(child)
        }
      })
    }
    return selectedCubes
  }

  function prepareRotation(selectorName, reverse) {
    history.push([selectorName.slice(-1), reverse])
    let direction = Math.PI / 2
    if (reverse) {
      direction = -Math.PI / 2
    }
    const selectedCubes = getCubesTouchingSelector(selectorName)

    const rotationGroup = new THREE.Group()
    selectedCubes.forEach((cube) => {
      rubiksCube.remove(cube)
      rotationGroup.add(cube)
    })
    scene.add(rotationGroup)

    let axis = selectRotationAxis(selectorName)

    const rotationAxis = new THREE.Vector3()
    if (axis === 'x') rotationAxis.set(1, 0, 0)
    if (axis === 'y') rotationAxis.set(0, 1, 0)
    if (axis === 'z') rotationAxis.set(0, 0, 1)

    const targetQuaternion = new THREE.Quaternion()
    targetQuaternion.setFromAxisAngle(rotationAxis, direction)
    console.log(history)

    return { rotationGroup, selectedCubes, targetQuaternion }
  }

  function mixCube() {
    const possibleMove = ['L', 'M', 'R', 'U', 'E', 'D', 'F', 'S', 'B']
    const sequence = []
    const moveNumber = 35
    
    while (sequence.length < moveNumber) {
      const randomElement =
      possibleMove[Math.floor(Math.random() * possibleMove.length)]
      if (
        sequence.length === 0 ||
        (randomElement !== sequence[sequence.length - 1] & randomElement !== sequence[sequence.length - 2])
      ) {
        sequence.push(randomElement)
      }
    }
    let index = 0
    
    console.log("🚀 ~ :89 ~ mixCube ~ sequence:", sequence)
    // const performMove = () => {
    //   let speed = this.mixSpeed
    //   if (index < sequence.length) {
    //     this.rotateGroup(sequence[index], false, speed)
    //     index++
    //     setTimeout(performMove, speed + 50)
    //   }
    // }

    // performMove()
  }

  return {
    prepareRotation,
  }
}
