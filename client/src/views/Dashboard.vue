<template>
  <div id="dashboard" class="container" ref="container">
    <Controls />
    <Transmission />
  </div>
</template>

<script lang="ts">
  import Controls from '../components/Controls.vue';
  import Transmission from '../components/Transmission.vue';
  import { setGlobalTimers, isPWA } from '../functions';
  import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
  import { useTorrents } from '../composables/useTorrents';

  export default defineComponent({
    name: 'Dashboard',
    components: {
      Controls,
      Transmission,
    },

    setup() {
      const { getTorrents } = useTorrents();
      const container = ref<HTMLDivElement>();

      getTorrents();
      setGlobalTimers('torrents');

      // onMounted(() => {
      //   if (!isPWA() && container.value) container.value.style.paddingTop = '16px';
      // });

      onUnmounted(() => {
        // @ts-ignore
        clearInterval(window.torrentTimer);
      });

      return {
        container,
      };
    },
  });
</script>

<style lang="scss">
  .container {
    // width: 100%;
    // height: 99.9%;
    // display: grid;
    // grid-template-columns: calc(100% / 3) auto;
    // overflow: hidden;

    @media screen and (max-width: 415px) {
      // grid-template-columns: 1fr;
      // grid-template-rows: 100px auto;
      // overflow: hidden;
    }
  }
</style>
