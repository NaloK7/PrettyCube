<script setup>
import { useStore } from '@/composables/useStore.js'
import { useCubeLogic } from '@/composables/useCubeLogic'

const { handleMixCube, handleResetCube, handleResetCamera } = useCubeLogic()
const { threeScene } = useStore()

function resetCube() {
  handleResetCube(threeScene.value)
}

function mixCube() {
  handleMixCube(threeScene.value)
}

function resetCamera() {
  handleResetCamera(threeScene.value)
}

</script>

<template>
  <nav class="interaction-bar">
    <button @click="resetCube" class="reset-scene">
      <svg
        width="31"
        height="25"
        viewBox="0 0 31 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="15.6042" cy="12.5" rx="11.2371" ry="11.5" fill="#D9D9D9" />
        <path
          d="M26.6163 10L29.6163 15H26.4358H23.6163L26.6163 10Z"
          fill="#393939"
        />
        <path
          d="M4.63379 15L1.63379 10L4.81434 10H7.63379L4.63379 15Z"
          fill="#393939"
        />
        <path
          d="M15.6336 1V0V1ZM6.70481 17.545C6.45349 17.0532 5.85108 16.8582 5.35929 17.1095C4.8675 17.3608 4.67256 17.9633 4.92387 18.455L5.81434 18L6.70481 17.545ZM24.5453 7.45505C24.7966 7.94684 25.399 8.14179 25.8908 7.89047C26.3826 7.63915 26.5776 7.03675 26.3263 6.54495L25.4358 7L24.5453 7.45505ZM29.6163 15V16C29.9766 16 30.309 15.8062 30.4865 15.4927C30.664 15.1792 30.6592 14.7944 30.4738 14.4855L29.6163 15ZM26.6163 10L27.4738 9.4855C27.2931 9.1843 26.9676 9 26.6163 9C26.2651 9 25.9396 9.1843 25.7588 9.4855L26.6163 10ZM23.6163 15L22.7588 14.4855C22.5735 14.7944 22.5686 15.1792 22.7461 15.4927C22.9236 15.8062 23.2561 16 23.6163 16V15ZM1.63379 10L1.63379 9C1.27352 9 0.941095 9.19379 0.763589 9.5073C0.586084 9.82081 0.590938 10.2056 0.776296 10.5145L1.63379 10ZM4.63379 15L3.7763 15.5145C3.95702 15.8157 4.28253 16 4.63379 16C4.98505 16 5.31056 15.8157 5.49128 15.5145L4.63379 15ZM7.63379 10L8.49128 10.5145C8.67664 10.2056 8.68149 9.82081 8.50399 9.5073C8.32648 9.19379 7.99406 9 7.63379 9V10ZM4.81434 10L4.81434 11H4.81434V10ZM5.81434 18L4.92387 18.455C6.90827 22.3382 10.9507 25 15.6165 25V24V23C11.7304 23 8.36053 20.785 6.70481 17.545L5.81434 18ZM25.4358 7L26.3263 6.54495C24.3419 2.66177 20.2995 1.78814e-07 15.6336 0V1V2C19.5197 2 22.8896 4.21504 24.5453 7.45505L25.4358 7ZM29.6163 15L30.4738 14.4855L27.4738 9.4855L26.6163 10L25.7588 10.5145L28.7588 15.5145L29.6163 15ZM26.6163 10L25.7588 9.4855L22.7588 14.4855L23.6163 15L24.4738 15.5145L27.4738 10.5145L26.6163 10ZM1.63379 10L0.776296 10.5145L3.7763 15.5145L4.63379 15L5.49128 14.4855L2.49128 9.4855L1.63379 10ZM4.63379 15L5.49128 15.5145L8.49128 10.5145L7.63379 10L6.7763 9.4855L3.7763 14.4855L4.63379 15ZM23.6163 15V16H26.4358V15V14H23.6163V15ZM26.4358 15V16H29.6163V15V14H26.4358V15ZM26.4358 15L25.4522 14.8197C24.599 19.473 20.5191 23 15.6165 23V24V25C21.5012 25 26.3952 20.7668 27.4194 15.1803L26.4358 15ZM7.63379 10V9H4.81434V10V11H7.63379V10ZM4.81434 10L4.81434 9L1.63379 9L1.63379 10L1.63379 11L4.81434 11L4.81434 10ZM4.81434 10L5.79794 10.1803C6.6511 5.52703 10.731 2 15.6336 2V1V0C9.74894 -2.38419e-07 4.85498 4.23316 3.83073 9.81966L4.81434 10Z"
          fill="#393939"
        />
      </svg>
    </button>
    <button @click="mixCube" class="start">
      <svg
        width="22"
        height="25"
        viewBox="0 0 22 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.4806 13.148L2.49614 23.4248C1.82948 23.8058 1 23.3244 1 22.5566V2.00296C1 1.23514 1.82948 0.753775 2.49614 1.13472L20.4806 11.4115C21.1524 11.7954 21.1524 12.7641 20.4806 13.148Z"
          fill="#C5C5C5"
          stroke="#393939"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button @click="resetCamera" class="reset-camera">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="12"
          transform="matrix(-1 0 0 1 25 1)"
          fill="#D9D9D9"
          stroke="#393939"
          stroke-width="2"
        />
        <path
          d="M13 25C15.2091 25 17 19.6274 17 13C17 6.37258 15.2091 1 13 1"
          stroke="#393939"
          stroke-width="2"
        />
        <path
          d="M13 25C10.7909 25 9 19.6274 9 13C9 6.37258 10.7909 1 13 1"
          stroke="#393939"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="3 3"
        />
        <path
          d="M1 13C1 15.2091 6.37258 17 13 17C19.6274 17 25 15.2091 25 13"
          stroke="#393939"
          stroke-width="2"
        />
        <path
          d="M1 13C1 10.7909 6.37258 9 13 9C19.6274 9 25 10.7909 25 13"
          stroke="#393939"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="3 3"
        />
      </svg>
    </button>
    <button @click="" class="memo-panel">
      <svg
        width="25"
        height="28"
        viewBox="0 0 25 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.34108 5.99252C5.45797 4.3398 6.89253 3.09476 8.54526 3.21166L20.5154 4.05828C22.1681 4.17517 23.4131 5.60973 23.2962 7.26246L22.1674 23.2226C22.0505 24.8753 20.6159 26.1204 18.9632 26.0035L6.99312 25.1568C5.34039 25.0399 4.09535 23.6054 4.21225 21.9527L5.34108 5.99252Z"
          fill="#D9D9D9"
          stroke="#393939"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          d="M1 4C1 2.34315 2.34315 1 4 1H16C17.6569 1 19 2.34315 19 4V20C19 21.6569 17.6569 23 16 23H4C2.34315 23 1 21.6569 1 20V4Z"
          fill="#D9D9D9"
          stroke="#393939"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          d="M10.6152 14.8105H8.4375C8.44401 14.2051 8.49609 13.6973 8.59375 13.2871C8.69141 12.8704 8.85417 12.4928 9.08203 12.1543C9.31641 11.8158 9.62565 11.4577 10.0098 11.0801C10.3092 10.7936 10.5794 10.5234 10.8203 10.2695C11.0612 10.0091 11.2533 9.73568 11.3965 9.44922C11.5397 9.15625 11.6113 8.82096 11.6113 8.44336C11.6113 8.0332 11.543 7.6849 11.4062 7.39844C11.2695 7.11198 11.0677 6.89388 10.8008 6.74414C10.5404 6.5944 10.2148 6.51953 9.82422 6.51953C9.4987 6.51953 9.19271 6.58464 8.90625 6.71484C8.61979 6.83854 8.38867 7.03385 8.21289 7.30078C8.03711 7.5612 7.94271 7.90625 7.92969 8.33594H5.57617C5.58919 7.51562 5.78451 6.82552 6.16211 6.26562C6.53971 5.70573 7.04753 5.28581 7.68555 5.00586C8.32357 4.72591 9.03646 4.58594 9.82422 4.58594C10.6966 4.58594 11.4421 4.73568 12.0605 5.03516C12.679 5.32812 13.151 5.75781 13.4766 6.32422C13.8086 6.88411 13.9746 7.5612 13.9746 8.35547C13.9746 8.92839 13.8607 9.44922 13.6328 9.91797C13.4049 10.3802 13.1087 10.8132 12.7441 11.2168C12.3796 11.6139 11.9857 12.0111 11.5625 12.4082C11.1979 12.7402 10.9505 13.1016 10.8203 13.4922C10.6901 13.8763 10.6217 14.3158 10.6152 14.8105ZM8.24219 17.8574C8.24219 17.5059 8.36263 17.2096 8.60352 16.9688C8.8444 16.7214 9.17318 16.5977 9.58984 16.5977C10.0065 16.5977 10.3353 16.7214 10.5762 16.9688C10.8171 17.2096 10.9375 17.5059 10.9375 17.8574C10.9375 18.209 10.8171 18.5085 10.5762 18.7559C10.3353 18.9967 10.0065 19.1172 9.58984 19.1172C9.17318 19.1172 8.8444 18.9967 8.60352 18.7559C8.36263 18.5085 8.24219 18.209 8.24219 17.8574Z"
          fill="#393939"
        />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.interaction-bar {
  min-height: 62px;
  z-index: 2;
  position: relative;
  padding: 0px 30px;
  background-color: #eaeaea;
  border-bottom: 1px solid #d3d3d3;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.memo-panel {
  position: absolute;
  right: 50px;
}

button {
  height: 40px;
  width: 80px;
  margin: 10px 20px;
  border: 2px solid #c5c5c5;
  border-radius: 10px;
  background-color: #fff;
}

button:hover {
  background-color: #d3d3d3 !important;
  border-color: #fff;
}

svg {
  display: block;
  margin: auto;
}

@media screen and (max-width: 700px) {
  .interaction-bar {
    justify-content: left;
  }
  .memo-panel {
    position: relative;
    right: unset;
  }
  button {
    margin: 10px auto;
  }
}

@media screen and (max-width: 375px) {
  .interaction-bar {
    min-height: 70px;
    margin: 0;
    padding: 0;
    justify-content: space-evenly;
    box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.25);
    border-bottom: none;
  }
  button {
    margin: 0;
    height: 70px;
    width: 100%;
    border-radius: 0;
    border-right: none;
  }
  button:first-of-type {
    border-left: none;
  }
  button:last-of-type {
    background-color: #eaeaea;
  }
  /* button:last-of-type:hover {
    background-color: #dadada;
  } */
}
</style>
