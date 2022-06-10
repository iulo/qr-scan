<template>
  <div class="app">
    <router-view></router-view>
  </div>
  <ReloadPrompt></ReloadPrompt>
</template>

<script setup lang="ts">
import ReloadPrompt from './components/ReloadPrompt.vue'
</script>

<style lang="scss">
@import "sanitize.css";
@import "sanitize.css/typography.css";
@import "sanitize.css/assets.css";

html {
  height: 100%;
}

body {
  height: 100%;
  /* https://developer.chrome.com/blog/overscroll-behavior/ */
  /* Disables pull-to-refresh but allows overscroll glow effects. */
  overscroll-behavior-y: contain;
}

.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  padding: 20px;
}

/* https://bulma.io/documentation/customize/with-webpack/#9-add-your-own-bulma-styles */
/* 
@import 'bulma/sass/base/_all.sass';
@import 'bulma/sass/elements/button.sass';
 */
/* @import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/elements/content.sass'; */
</style>
