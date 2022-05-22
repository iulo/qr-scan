<template>
  <Scanner @onsuccess="onSuccess"></Scanner>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Scanner from '../components/Scanner/Scanner.vue'
import { useStore } from '../store';

const store = useStore()
const router = useRouter()

const onSuccess = (txt: string) => {
  store.setScanText(txt)
  router.back()
}
</script>

<script lang="ts">
export default {
  beforeRouteEnter(to, from, next) {
    console.log(from)
    if (from.href) {
      next()
    } else {
      next('/')
    }
  }
}
</script>

<style scoped>
</style>