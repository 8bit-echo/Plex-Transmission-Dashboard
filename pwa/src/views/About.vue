<template>
  <div class="about">
    <iframe :src="app"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      app: `http://${process.env.VUE_APP_HOST}`
    };
  }
};
</script>

<style lang="css" scoped>
iframe {
  position: relative;
  width: 100vw;
  left: -1rem;
  height: 100%;
  border: none;
  outline: none;
}
</style>
