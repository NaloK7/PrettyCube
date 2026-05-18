import { shallowRef, ref  } from 'vue'

const threeScene = shallowRef(null)
const resetScene = ref(false)
export function useStore() {

  return {
    threeScene,
    resetScene
  }
}