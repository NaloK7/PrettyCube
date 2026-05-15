import * as THREE from 'three'

export function useCubeAnimation(cubeScene) {
    
      // function startAnimation() {
      //   isAnimate.value = true
      // }
      // function stopAnimation() {
      //   isAnimate.value = false
      // }
    
      // function animateRotation(group, selected, targetQuaternion) {
      //   return new Promise((resolve) => {
      //     const speed = 0.15
    
      //     function update() {
      //       group.quaternion.slerp(targetQuaternion, speed)
    
      //       if (group.quaternion.angleTo(targetQuaternion) > 0.004) {
      //         requestAnimationFrame(update)
      //       } else {
      //         group.quaternion.copy(targetQuaternion)
      //         reparentSelectedCubes(group, selected)
      //         resolve() // Resolve the Promise when the animation is complete
      //       }
      //     }
    
      //     update()
      //   })
      // }
    
      // function reparentSelectedCubes(group, selected) {
      //   //todo move to useCubeLogic
      //   selected.forEach((cube) => {
      //     cube.position.copy(cube.getWorldPosition(new THREE.Vector3()))
      //     cube.quaternion.copy(cube.getWorldQuaternion(new THREE.Quaternion()))
    
      //     rubiksCube.add(cube)
      //   })
      //   scene.remove(group)
      // }
}