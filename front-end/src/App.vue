<template>
  <div id="app" class="container">
    <controls />
    <transmission />
  </div>
</template>

<script>
import Vue from 'vue';
import Controls from './components/Controls.vue';
import Transmission from './components/Transmission.vue';

export default Vue.extend({
  name: 'app',
  components: {
    Controls,
    Transmission
  }
});
</script>

<style lang="scss">
html {
  overflow: hidden;
  height: 100vh;
  // cursor: none !important;
}
body {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  width: 100%;
  height: 99.9%;
  display: grid;
  grid-template-columns: calc(100% / 3) auto;
  overflow: hidden;
}
</style>
