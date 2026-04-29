import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ref } from 'vue'

/* components:
  - rubiks cube:
    - 81 elements:
      - corner: 3 faces
      - middle: 2 faces
      - center: 1 face
      - one special in the middle of the cube: no face
      - name: Cube_LDB → (name)_(move possible)
    - face:
      - name: Cube_LDB_green → (name)_(move possible)_(color)
  - detectorGrp: 
    - 54 elements
    - fixed, unmovable
    - used to know which cube is in that location
  - selectorGrp:
    - 9 elements 
    - fixed, unmovable
    - intersect all cube involved in a movement
    - one for each movements
    - name: selector_B → intersect all the cube involved in B (back) mouvement
*/
const MODEL_PATHS = {
  base: '/rubiksCubeFaced.glb',
  memoYellowOnly: '/rubiksCubeYellowOnly.glb',
}

export async function useThreeScene(container, options = {}) {
  const { modelPath = 'base' } = options
  const containerRect = container.getBoundingClientRect()
  const width = containerRect.width
  const height = containerRect.height
  const isAnimate = ref(false)
  let animationId = null
  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)

  // Camera
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000)
  camera.position.set(1, 0, 0)
  camera.position.set(5.9, 5.5, 5.5)
  camera.lookAt(scene.position)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  container.appendChild(renderer.domElement)

  // Orbit controls
  const controls = ref(new OrbitControls(camera, renderer.domElement))
  controls.value.minDistance = 30 // Minimum zoom in
  controls.value.maxDistance = 40 // Maximum zoom out
  controls.value.target.set(0, 0, 0) // Set the target for the camera to look at
  controls.value.update() // Update the controls

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.7)
  scene.add(ambientLight)

  const spotLight = new THREE.SpotLight(0xffffff, 80)
  spotLight.position.set(2, 8, -2)
  spotLight.lookAt(scene.position)
  scene.add(spotLight)

  // Load GLB model
  const loader = new GLTFLoader()
  let rubiksCube = null
  let selectorGrp = null
  let detectorGrp = null
  try {
    const gltf = await loader.loadAsync(MODEL_PATHS[modelPath])
    const cube = gltf.scene
    scene.add(cube)
    cube.position.set(0, 0, 0)
    // Access groups via userData.type
    cube.traverse((child) => {
      if (child.userData.type === 'rubiksCube') {
        rubiksCube = child
        // rubiksCube.visible = false
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
    if (!animationId) return // Arrête la boucle si `animationId` est null
    animationId = requestAnimationFrame(animate)
    controls.value.update()
    renderer.render(scene, camera)
  }
  animationId = requestAnimationFrame(animate) // Démarre la boucle

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

  function startAnimation() {
    isAnimate.value = true
  }
  function stopAnimation() {
    isAnimate.value = false
  }

  function animateRotation(group, selected, targetQuaternion) {
    return new Promise((resolve) => {
      const speed = 0.15

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
    selected.forEach((cube) => {
      cube.position.copy(cube.getWorldPosition(new THREE.Vector3()))
      cube.quaternion.copy(cube.getWorldQuaternion(new THREE.Quaternion()))

      rubiksCube.add(cube)
    })
    scene.remove(group)
  }

  function cleanup() {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null // Évite les références fantômes
    }
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }

    if (controls.value) {
      controls.value.dispose()
      controls.value = null;
    }

    if (ambientLight) scene.remove(ambientLight)
    if(spotLight) scene.remove(spotLight)
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
              // Libère TOUTES les textures du matériau
              Object.values(mat).forEach((prop) => {
                if (prop && prop instanceof THREE.Texture) prop.dispose()
              })
              mat.dispose()
            })
          } else {
            // Libère TOUTES les textures du matériau
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
      renderer.forceContextLoss() // Force la libération du contexte WebGL
      renderer.domElement = null // Supprime la référence au canvas
    }

  }

  return {
    scene,
    camera,
    renderer,
    controls,
    isAnimate,
    rubiksCube,
    detectorGrp,
    selectorGrp,
    containerRect,
    startAnimation,
    stopAnimation,
    animateRotation,
    cleanup,
  }
}
