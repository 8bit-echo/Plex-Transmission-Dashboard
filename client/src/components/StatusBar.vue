<template>
  <div
    class="status-bar"
    ref="statusBar"
  >
    <div class="vpnStatus indicator">
      VPN
      <div :class="{ statusLight: true, active: vpnStatus === 'ACTIVE' }"></div>
    </div>
    <div
      class="loading-indicator indicator"
      v-if="isLoading"
    >
      <img
        src="../assets/spinner.svg"
        width="25"
      />
    </div>
  </div>
</template>

<script>
  import { deviceType } from '@/functions.js';
  export default {
    data() {
      return {
        vpnStatus: '-',
        isLoading: false
      };
    },

    mounted() {
      if (deviceType() === 'iPhone X') {
        this.$refs.statusBar.style.paddingTop = '45px';
        this.$refs.statusBar.style.top = '0';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .status-bar {
    position: fixed;
    z-index: 3;
    background: rgb(32, 32, 39);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-top: 45px;
    // top: 0;
    .indicator {
      display: flex;
      align-items: center;
      background: rgb(32, 32, 39);
      padding: 5px;
      color: lightgrey;
    }
    .statusLight {
      width: 0.75rem;
      height: 0.75rem;
      border: solid 1px lightgrey;
      border-radius: 50%;
      display: inline-block;
      margin: 0 10px;
      background-color: #c76172;

      &.active {
        background-color: #2bca2b;
      }
    }
  }
</style>