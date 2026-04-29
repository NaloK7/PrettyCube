import { ref } from 'vue'
import * as THREE from 'three'
import { vectorUtils } from '@/utils/vectorUtils'
import { useCubeLogic } from '@/composables/useCubeLogic'


export function useCubeEvents(container, threeScene) {
  let startMouse = null
  let endMouse = null
  let dragging = false
  let selectedFace = null
  let rightVector, upVector
  const MIN_DRAG_DISTANCE = 0.14 // minimal mouse distance to trigger a mouvement
  
  const { getLocalVectors, determineDragDirection } = vectorUtils()
  const { prepareRotation } = useCubeLogic(threeScene.scene, threeScene.rubiksCube, threeScene.selectorGrp)

  function onMouseDown(event) {
    // todo: prevent animation with MMB & RMB
    
    if (!threeScene.isAnimate.value) {
      const raycaster = new THREE.Raycaster()
      startMouse = new THREE.Vector2(
        ((event.clientX - threeScene.containerRect.left) / threeScene.containerRect.width) * 2 - 1,
        -((event.clientY - threeScene.containerRect.top) / threeScene.containerRect.height) * 2 + 1
      )
      raycaster.setFromCamera(startMouse, threeScene.camera)
      const intersect = raycaster.intersectObjects(
        Object.values(threeScene.detectorGrp.children),
        true
      )[0]
      if (intersect) {
        dragging = true
        threeScene.controls.value.enabled = false
        selectedFace = intersect.object
        let point = intersect.point.clone()
        point.project(threeScene.camera)
        let vectors = getLocalVectors(selectedFace, threeScene.camera)
        rightVector = vectors.rightVector
        upVector = vectors.upVector
      }
    }
  }

  function onMouseDrag(event) {
    if (!dragging) return
    
    endMouse = new THREE.Vector2(
      ((event.clientX - threeScene.containerRect.left) / threeScene.containerRect.width) * 2 - 1,
      -((event.clientY - threeScene.containerRect.top) / threeScene.containerRect.height) * 2 + 1
    )
    
    const mouseVector = new THREE.Vector2(
      endMouse.x - startMouse.x,
      endMouse.y - startMouse.y
    )
    
    if (mouseVector.length() < MIN_DRAG_DISTANCE) return
    threeScene.startAnimation()
    dragging = false
    let horizontalMove = selectedFace.userData.horMouv
    let verticalMove = selectedFace.userData.verMouv
    let moveSelected = determineDragDirection(
      mouseVector,
      horizontalMove,
      verticalMove,
      rightVector,
      upVector
    )

    const { rotationGroup, selectedCubes, targetQuaternion } = prepareRotation(
      moveSelected.name,
      moveSelected.reverse
    )
     threeScene.animateRotation(rotationGroup, selectedCubes, targetQuaternion)
       .then(() => {
      threeScene.stopAnimation();
      threeScene.controls.value.enabled = true;
    });
  }

  function onMouseUp() {
    startMouse = null
    endMouse = null
    selectedFace = null
    dragging = false
    if (!threeScene.isAnimate.value) {
      threeScene.controls.value.enabled = true
    }
  }
  container.addEventListener('mousedown', onMouseDown)
  container.addEventListener('mouseup', onMouseUp)
  container.addEventListener('mousemove', onMouseDrag)

  function cleanup() {
    container.removeEventListener('mousedown', onMouseDown)
    container.removeEventListener('mouseup', onMouseUp)
    container.removeEventListener('mousemove', onMouseDrag)
  }
  return {
    cleanup,
  }
}
