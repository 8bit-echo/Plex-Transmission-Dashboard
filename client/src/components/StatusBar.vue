<template>
  <div class="status-bar" ref="statusBar">
    <div class="vpnStatus indicator">
      VPN
      <div :class="{ statusLight: true, active: vpnActive }"></div>
    </div>

    <div class="finished indicator" v-show="finishedTorrents > 0">
      {{ finishedTorrents }} ✓
    </div>

    <div class="download indicator" v-show="totalDownloadSpeed !== ''">
      {{ totalDownloadSpeed }} ↓
    </div>

    <div class="loading-indicator indicator" v-if="isLoading">
      <img src="@/assets/spinner.svg" width="25" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  computed: {
    ...mapState(['isLoading', 'vpnActive']),
    ...mapGetters(['totalDownloadSpeed', 'finishedTorrents'])
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

  .finished {
    color: #2bca2b;
  }
}
</style>