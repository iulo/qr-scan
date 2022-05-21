<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <Scanner v-if="isShowScanner" @onsuccess="onScanSuccess"></Scanner>
  <p>{{ text }}</p>
  <button @click="openScanner">scan</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Scanner from './components/Scanner.vue'

const isShowScanner = ref(false)
const text = ref('')

const onScanSuccess = (scanText: string) => {
  text.value = scanText
  isShowScanner.value = false
}

const openScanner = () => {
  isShowScanner.value = true
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
