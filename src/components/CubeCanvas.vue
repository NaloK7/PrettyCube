<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useThreeScene } from '../composables/useThreeScene.js'
import { useCubeEvents } from '../composables/useCubeEvents.js'

const containerRef = ref(null)

let threeScene = null
let cubeEvents = null

onMounted(async () => {
  if (containerRef.value) {
    // await useThreeScene(containerRef.value, {modelPath: 'memoYellowOnly'})
    threeScene = await useThreeScene(containerRef.value, { modelPath: 'base' })
    cubeEvents = useCubeEvents(containerRef.value, threeScene)
  }
})

onUnmounted(() => {
  if (cubeEvents) {
    cubeEvents.cleanup()
    cubeEvents = null
  }
  if (threeScene) {
    threeScene.cleanup()
    threeScene = null
  }
})
</script>

<template>
  <div ref="containerRef" class="cube-container"></div>
</template>

<style scoped>
.cube-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
</style>
