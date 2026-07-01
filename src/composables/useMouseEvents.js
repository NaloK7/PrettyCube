import * as THREE from 'three'
import { vectorUtils } from '@/utils/vectorUtils'
import { useCubeLogic } from '@/composables/useCubeLogic'

export function useMouseEvents() {
  let startMouse = null
  let endMouse = null
  let dragging = false
  let intersectedDetector = null
  let rightVector, upVector
  const MIN_DRAG_DISTANCE = 0.14 // minimal mouse distance to trigger a mouvement

  const {
    getLocalVectors,
    determineDragDirection,
    normalizeFaceVectors,
    getMouseNDC,
  } = vectorUtils()

  const { prepareRotation } = useCubeLogic()

  function handleMouseDown(event, threeScene) {
    let isAnimate = threeScene.isAnimate
    if (!isAnimate) {
      const raycaster = new THREE.Raycaster()
      startMouse = getMouseNDC(event, threeScene.containerRect)
      raycaster.setFromCamera(startMouse, threeScene.camera)
      const intersect = raycaster.intersectObjects(
        Object.values(threeScene.detectorGrp.children),
        true
      )[0]
      if (intersect) {
        intersectedDetector = intersect.object
        dragging = true
        threeScene.OrbitControl.enabled = false
        let vectors = getLocalVectors(intersectedDetector, threeScene.camera)
        vectors = normalizeFaceVectors(
          intersectedDetector.userData.face,
          vectors.rightVector,
          vectors.upVector
        )
        rightVector = vectors.rightVector
        upVector = vectors.upVector
      }
    }
  }

  function handleMouseMove(event, threeScene) {
    if (!dragging) return

    endMouse = getMouseNDC(event, threeScene.containerRect)

    const start3D = new THREE.Vector3(startMouse.x, startMouse.y, 0).unproject(
      threeScene.camera
    )

    const end3D = new THREE.Vector3(endMouse.x, endMouse.y, 0).unproject(
      threeScene.camera
    )

    const dragVector3D = end3D.sub(start3D).normalize()

    const mouseDistance = endMouse.distanceTo(startMouse)
    if (mouseDistance < MIN_DRAG_DISTANCE) return
    threeScene.startAnimation()
    dragging = false
    let horizontalMove = intersectedDetector.userData.horMouv // string: selector_B
    let verticalMove = intersectedDetector.userData.verMouv
    let moveSelected = determineDragDirection(
      dragVector3D,
      horizontalMove,
      verticalMove,
      rightVector,
      upVector
    )
    // selector:
    const { rotationGroup, selectedCubes, targetQuaternion } = prepareRotation(
      threeScene,
      moveSelected.name,
      moveSelected.reverse
    )
    threeScene
      .animateRotation(rotationGroup, selectedCubes, targetQuaternion)
      .then(() => {
        threeScene.stopAnimation()
        threeScene.OrbitControl.enabled = true
      })
  }

  function handleMouseUp(threeScene) {
    startMouse = null
    endMouse = null
    intersectedDetector = null
    dragging = false
    if (!threeScene.isAnimate) {
      threeScene.OrbitControl.enabled = true
    }
  }

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
