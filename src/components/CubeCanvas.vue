<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/composables/useStore.js'
import { useCubeScene } from '@/composables/useCubeScene.js'
import { useMouseEvents } from '@/composables/useMouseEvents.js'

const containerRef = ref(null)

const { threeScene } = useStore()
let mouseEvents = null

function onMouseDown(event) {
  if (mouseEvents && threeScene.value) {
    mouseEvents.handleMouseDown(event, threeScene.value)
  }
}

function onMouseMove(event) {
  if (mouseEvents && threeScene.value) {
    mouseEvents.handleMouseMove(event, threeScene.value)
  }
}

function onMouseUp() {
  if (mouseEvents && threeScene.value) {
    mouseEvents.handleMouseUp(threeScene.value)
  }
}

onMounted(async () => {
  if (containerRef.value) {
    // await useCubeScene(containerRef.value, {modelPath: 'memoYellowOnly'})
    threeScene.value = await useCubeScene(containerRef.value, {
      modelPath: 'base',
    })

    mouseEvents = useMouseEvents(containerRef.value)
  }
})

onUnmounted(() => {
  if (threeScene.value) {
    threeScene.value.cleanup()
    threeScene.value = null
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="cube-container"
    @mousedown.left="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  ></div>
</template>

<style scoped>
.cube-container {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
}
</style>
