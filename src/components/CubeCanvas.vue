<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene.js'

const containerRef = ref(null)

onMounted(async () => {
  if (containerRef.value) {
    // await useThreeScene(containerRef.value, {modelPath: 'memoYellowOnly'})
    await useThreeScene(containerRef.value, {modelPath: 'base'})
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
}
</style>