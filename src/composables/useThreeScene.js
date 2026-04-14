import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_PATHS = {
  base: '/rubiksCubeFaced.glb',
  memoYellowOnly: '/rubiksCubeYellowOnly.glb'
}

export async function useThreeScene(container, options = {}) {
  const {
    modelPath = 'base'
  } = options
  const containerRect = container.getBoundingClientRect();
  const width = containerRect.width;
  const height = containerRect.height;

  // 1. Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 2. Camera
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
  camera.position.set(1, 0, 0);
  camera.position.set(5.9, 5.5, 5.5);
  camera.lookAt(scene.position);

  // 3. Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // 4. Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 30; // Minimum zoom in
  controls.maxDistance = 40; // Maximum zoom out
  controls.target.set(0, 0, 0); // Set the target for the camera to look at
  controls.update(); // Update the controls

  // 5. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.7);
  scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 80);
  spotLight.position.set(2, 8, -2);
  spotLight.lookAt(scene.position);
  scene.add(spotLight);

  // 6. Load GLB model
  const loader = new GLTFLoader();
  let rubiksCube = null;
  let selectorGrp = null;
  let detectorGrp = null;
  try {
    const gltf = await loader.loadAsync(MODEL_PATHS[modelPath]);
    const cube = gltf.scene;
    scene.add(cube);
    cube.position.set(0, 0, 0);
    // console.log(cube)
    // Access groups via userData.type
    cube.traverse((child) => {
      if (child.userData.type === "rubiksCube") {
        rubiksCube = child;
      } if (child.userData.type === "selectorGrp") {
        selectorGrp = child;
        selectorGrp.visible = false;
      } if (child.userData.type === "detectorGrp") {
        detectorGrp = child;
        detectorGrp.visible = false;
      }
    });
  } catch (error) {
    console.error("error loading model:", error);
  }

  // 7. Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 8. Handle resize
  function updateSize() {
    const newRect = container.getBoundingClientRect();
    const newHeight = newRect.height;
    const newWidth = newRect.width;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }
  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(container);

  return {
    scene,
    camera,
    renderer,
    controls,
    cleanup: () => {
      resizeObserver.disconnect();
      container.removeChild(renderer.domElement);
    },
  };
}
