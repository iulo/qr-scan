<template>
  <div class="main">
    <div class="content is-normal">
      <h3>scan result</h3>
      <p class="block scan-result">{{ store.scanText }}</p>
    </div>
    <div class="action">
      <button class="button is-primary is-medium is-fullwidth" @click="openScanner">Scan</button>
      <button class="button is-info is-medium is-fullwidth" @click="copy">Copy</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useStore } from '../store'

const router = useRouter()
const store = useStore()

const toast = useToast()

// console.log(store.scanText)
// const onScanSuccess = (scanText: string) => {
//   text.value = scanText
//   isShowScanner.value = false
// }

const openScanner = () => {
  router.push('/scan')
  // isShowScanner.value = true
}

const copy = async () => {
  await navigator.clipboard.writeText(store.scanText)
  toast.success('success copied!', { position: 'top', duration: 1500 })
}
</script>

<style scoped>
.action {
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
}

.button {
  font-weight: bold;
  margin-top: 10px;
}

.scan-result {
  font-size: 14px;
  padding: 10px;
  background-color: #eee;
  min-height: 200px;
  word-break: break-all;
}
</style>