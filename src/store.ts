import { defineStore } from 'pinia'

export const useStore = defineStore('global', {
  state: () => {
    return {
      scanText: ''
    }
  },
  actions: {
    setScanText(payload: string) {
      this.scanText = payload
    }
  }
})
