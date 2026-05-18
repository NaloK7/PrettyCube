<script setup>
import CubeCanvas from './components/CubeCanvas.vue'
import InteractionBar from './components/InteractionBar.vue'
</script>

<template>
  <div id="app">
    <InteractionBar id="interaction-bar" />
    <CubeCanvas id="cube-canvas" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
@media screen and (max-width: 375px) {
#app { 
  flex-direction: column-reverse;
}
}
</style>
