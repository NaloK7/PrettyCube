import * as THREE from 'three'

export function useCubeLogic() {
  const history = []

  // ROTATION
  /**
   * Retrieves all cubes from the Rubik's Cube scene that intersect with a specified selector.
   *
   * @param {string} selectorName - The name of the selector to check for intersections.
   * @returns {Array} An array of cube objects that intersect with the specified selector.
   *
   * Warns if the specified selector is not found.
   */
  function getCubesTouchingSelector(threeScene, selectorName) {
    const selector = threeScene.selectorGrp.children.filter(
      (child) => child.name === selectorName
    )[0]
    let selectedCubes = []

    if (!selector) {
      console.warn(`Can't find: ${selectorName}.`)
    } else {
      const selectorBox = new THREE.Box3().setFromObject(selector)

      threeScene.rubiksCube.children.forEach((child) => {
        if (!child.name.startsWith('Cube')) return

        const cubeBox = new THREE.Box3().setFromObject(child)
        if (selectorBox.intersectsBox(cubeBox)) {
          selectedCubes.push(child)
        }
      })
    }
    return selectedCubes
  }

  function prepareDrag(threeScene, selectorName) {
    let activeSelector = threeScene.selectorGrp.children.find(
      (child) => child.name === selectorName
    )
    threeScene.OrbitControl.enabled = false
    return activeSelector
  }

  function prepareRotation(threeScene, selectorName, reverse) {
    let activeSelector = prepareDrag(threeScene, selectorName)
    history.push([selectorName.slice(-1), reverse])
    let direction = Math.PI / 2
    if (reverse) {
      direction = -Math.PI / 2
    }
    const selectedCubes = getCubesTouchingSelector(threeScene, selectorName)

    const rotationGroup = new THREE.Group()
    selectedCubes.forEach((cube) => {
      threeScene.rubiksCube.remove(cube)
      rotationGroup.add(cube)
    })
    threeScene.scene.add(rotationGroup)

    let axis = activeSelector.userData.axis

    const rotationAxis = new THREE.Vector3()
    if (axis === 'x') rotationAxis.set(1, 0, 0)
    if (axis === 'y') rotationAxis.set(0, 1, 0)
    if (axis === 'z') rotationAxis.set(0, 0, 1)

    const targetQuaternion = new THREE.Quaternion()
    targetQuaternion.setFromAxisAngle(rotationAxis, direction)

    return { rotationGroup, selectedCubes, targetQuaternion }
  }

  function handleMixCube(threeScene) {
    const sequence = generateRandomMoves()
    let index = 0

    const performMove = () => {
      let speed = 1
      if (index < sequence.length) {
        let selectorName = sequence[index]
        const { rotationGroup, selectedCubes, targetQuaternion } =
        prepareRotation(threeScene, selectorName, false)
        threeScene
          .animateRotation(rotationGroup, selectedCubes, targetQuaternion, 0.25)
          .then(() => {
            threeScene.stopAnimation()
            threeScene.OrbitControl.value.enabled = true
            index++
            setTimeout(performMove, speed + 50)
          })
      }
    }
    performMove()

  }
  function generateRandomMoves() {

    const possibleMove = ['L', 'M', 'R', 'U', 'E', 'D', 'F', 'S', 'B']
    const sequence = []
    const moveNumber = 25

    while (sequence.length < moveNumber) {
      const randomElement =
        possibleMove[Math.floor(Math.random() * possibleMove.length)]
      if (
        sequence.length === 0 ||
        (randomElement !== sequence[sequence.length - 1]) &
          (randomElement !== sequence[sequence.length - 2])
      ) {
        sequence.push(`selector_${randomElement}`)
      }
    }
    
    return sequence
  }

  return {
    prepareRotation,
    prepareDrag,
    handleMixCube,
    generateRandomMoves
  }
}
