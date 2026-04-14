<template>
  <div id="app">
    <CubeCanvas />
  </div>
</template>

<script setup>
import CubeCanvas from './components/CubeCanvas.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>