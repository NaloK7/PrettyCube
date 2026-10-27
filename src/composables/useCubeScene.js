import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ref } from 'vue'

/* components:
  - rubiksCube:                               ## the whole main cube ##
    - useData:
      - name: "RubiksCube"
      - type: "rubiksCube"
    - children:                               ## 27 little cube ##
      -- useData:
        -- type: "cube"
        -- name: "Cube_LDB" → Cube_(move possible)
      -- children:                            ## 0-3 face(s) ##
        --- type: "face"  
        --- name: "Cube_LDB_green" → Cube_(move possible)_(color)
        --- color: "green"

  - detectorGrp:
    - userData:
      - face: (down, up, left, ...)
      - type: "detector"
      - horMouv: (selector_B, ...)
      - verMouv: (selector_B, ...)
    - 54 elements
    - fixed, unmovable
    - used to know which cube is in that location
    
  - selectorGrp:
    - useData:
      - axis: (x, y, z)
      - mouvement: (L, R, B, ...)
      - type: "selector"
    - 9 elements 
    - fixed, unmovable
    - intersect all cube involved in a movement
    - one for each movements
    - name: selector_B → intersect all the cube involved in B (back) mouvement
*/
const MODEL_PATHS = {
  base: '/rubiksCubeFaced0.1.glb',
  memoYellowOnly: '/rubiksCubeYellowOnly.glb',
}

export async function useCubeScene(container, options = {}) {
  const { modelPath = 'base' } = options
  const containerRect = container.getBoundingClientRect()
  if (containerRect.width === 0 || containerRect.height === 0) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const width = containerRect.width
  const height = containerRect.height
  let isAnimate = false
  let animationId = null
  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // Camera
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
  camera.position.set(1, 1, 1)
  camera.lookAt(scene.position)
  let cameraResetting = false

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Orbit controls

  const OrbitControl = new OrbitControls(camera, renderer.domElement)
  OrbitControl.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.NONE,
    RIGHT: THREE.MOUSE.NONE,
  }
  OrbitControl.minDistance = 30 // Minimum zoom in
  OrbitControl.maxDistance = 40 // Maximum zoom out
  OrbitControl.target.set(0, 0, 0) // Set the target for the camera to look at
  OrbitControl.update() // Update the controls
  let orbitStartPos = new THREE.Vector3()
  orbitStartPos.copy(OrbitControl.object.position)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.7)
  scene.add(ambientLight)

  const spotLight = new THREE.SpotLight(0xffffff, 80)
  spotLight.position.set(2, 8, -2)
  spotLight.lookAt(scene.position)
  scene.add(spotLight)

  // Load GLB model
  const loader = new GLTFLoader()
  let cube = null
  let rubiksCube = null
  let selectorGrp = null
  let detectorGrp = null
  try {
    const gltf = await loader.loadAsync(MODEL_PATHS[modelPath])
    cube = gltf.scene
    scene.add(cube)
    cube.position.set(0, 0, 0)

    // Access groups via userData.type
    cube.traverse((child) => {
      // Save initial stat
      child.userData.initialState = {
        position: child.position.clone(),
        quaternion: child.quaternion.clone(),
        scale: child.scale.clone(),
      }
      if (child.userData.type === 'rubiksCube') {
        rubiksCube = child
      }
      if (child.userData.type === 'selectorGrp') {
        selectorGrp = child
        selectorGrp.visible = false
      }
      if (child.userData.type === 'detectorGrp') {
        detectorGrp = child
        detectorGrp.visible = false
      }
    })
  } catch (error) {
    console.error('error loading model:', error)
  }

  // Animation loop
  function animate() {
    if (!animationId) return
    animationId = requestAnimationFrame(animate)
    if (!cameraResetting) {
      OrbitControl.update()
    }
    renderer.render(scene, camera)
  }
  animationId = requestAnimationFrame(animate)

  // Handle resize
  function updateSize() {
    const newRect = container.getBoundingClientRect()
    const newHeight = newRect.height
    const newWidth = newRect.width
    camera.aspect = newWidth / newHeight
    camera.updateProjectionMatrix()
    renderer.setSize(newWidth, newHeight)
  }
  let resizeObserver = new ResizeObserver(updateSize)
  resizeObserver.observe(container)

  // ANIMATION ############

  function startAnimation() {
    isAnimate = true
    OrbitControl.enableRotate = false
  }

  function stopAnimation() {
    isAnimate = false
    OrbitControl.enableRotate = true
  }
  /**
   * Reset the camera to its initial position smoothly
   * 
   */
  function resetCamera() {
    if (cameraResetting) return

    OrbitControl.enableRotate = false
    cameraResetting = true

    requestAnimationFrame(updateCamera)
  }
  /**
   * Single animation for the camera resetting
   * 
   */
  function updateCamera() {
    if (!cameraResetting) return
    // orbitStartPos -> starting position of the camera
    OrbitControl.object.position.lerp(orbitStartPos, 0.1)
    OrbitControl.update()

    const done = OrbitControl.object.position.distanceTo(orbitStartPos) < 0.3

    if (done) {
      OrbitControl.object.position.copy(orbitStartPos)
      OrbitControl.update()

      OrbitControl.enableRotate = true
      cameraResetting = false
    } else {
      requestAnimationFrame(updateCamera)
    }
  }

  function animateRotation(group, selected, targetQuaternion, speed = 0.15) {
    return new Promise((resolve) => {
      function update() {
        group.quaternion.slerp(targetQuaternion, speed)

        if (group.quaternion.angleTo(targetQuaternion) > 0.004) {
          requestAnimationFrame(update)
        } else {
          group.quaternion.copy(targetQuaternion)
          reparentSelectedCubes(group, selected)
          resolve() // Resolve the Promise when the animation is complete
        }
      }

      update()
    })
  }

  function reparentSelectedCubes(group, selected) {
    //todo move to useCubeLogic
    selected.forEach((cube) => {
      cube.position.copy(cube.getWorldPosition(new THREE.Vector3()))
      cube.quaternion.copy(cube.getWorldQuaternion(new THREE.Quaternion()))

      rubiksCube.add(cube)
    })
    scene.remove(group)
  }
  // CLEAN-UP ######

  function cleanup() {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }

    if (OrbitControl.value) {
      OrbitControl.dispose()
      OrbitControl = null
    }

    if (ambientLight) scene.remove(ambientLight)
    if (spotLight) scene.remove(spotLight)
    if (rubiksCube) scene.remove(rubiksCube)
    rubiksCube = null
    if (selectorGrp) scene.remove(selectorGrp)
    selectorGrp = null
    if (detectorGrp) scene.remove(detectorGrp)
    detectorGrp = null

    scene.traverse((object) => {
      if (object.isMesh) {
        if (object.geometry) object.geometry.dispose()

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              Object.values(mat).forEach((prop) => {
                if (prop && prop instanceof THREE.Texture) prop.dispose()
              })
              mat.dispose()
            })
          } else {
            Object.values(object.material).forEach((prop) => {
              if (prop && prop instanceof THREE.Texture) prop.dispose()
            })
            object.material.dispose()
          }
        }
      }
    })

    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement)
    }
    if (renderer) {
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement = null
    }
  }

  return {
    scene,
    camera,
    renderer,
    OrbitControl,
    isAnimate,
    rubiksCube,
    detectorGrp,
    selectorGrp,
    containerRect,
    startAnimation,
    stopAnimation,
    animateRotation,
    cleanup,
    resetCamera,
  }
}
