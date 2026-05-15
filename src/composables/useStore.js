import { shallowRef  } from 'vue'

// 
const threeScene = shallowRef(null)

export function useStore() {

  return {
    threeScene
  }
}