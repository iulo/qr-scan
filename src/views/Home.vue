<template>
  <div class="main">
    <div class="content is-normal">
      <h3>scan result</h3>
      <p class="block" :class="$style.scanResult">{{ store.scanText }}</p>
      <div class="flex justify-between">
        <v-btn :disabled="store.scanText.length === 0" :class="$style.button" class="w-44vw" flat size="small"
          color="info" @click="open">
          Open it
        </v-btn>
        <v-btn :disabled="store.scanText.length === 0" :class="$style.button" class="w-44vw" flat size="small"
          color="info" @click="copy">
          Copy text
        </v-btn>
      </div>
    </div>
    <div :class="$style.action">
      <div class="flex justify-between">
        <!-- <v-btn :class="$style.button" class="w-44vw" flat size="large" color="success" @click="openScanner">
          <v-icon size="x-large" :icon="mdiImage" />
        </v-btn> -->
        <v-btn :class="$style.button" class="w-44vw" block flat size="large" color="success" @click="openScanner">
          <v-icon size="x-large" :icon="mdiCamera" />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { mdiCamera, mdiImage } from '@mdi/js'
import { useStore } from '../store'

const router = useRouter()
const store = useStore()

const toast = useToast()

const openScanner = () => {
  router.push('/scan')
  // isShowScanner.value = true
}

const copy = async () => {
  await navigator.clipboard.writeText(store.scanText)
  toast.success('success copied!', { position: 'top', duration: 1500 })
}

const open = () => {
  window.open(store.scanText, '_blank')
}
</script>

<style module>
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
  color: #fff;
}

.scanResult {
  font-size: 14px;
  padding: 10px;
  background-color: #eee;
  min-height: 200px;
  word-break: break-all;
}
</style>