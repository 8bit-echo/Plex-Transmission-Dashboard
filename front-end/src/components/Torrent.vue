<template>
  <div class="torrent">
    <div class="inner-container">
      <p class="name">{{ torrent.name | cleanup }}</p>
      <div class="meta">
        {{ torrent.percentDone | toPercentage }}
        <span class="download-rate" v-if="torrent.downloadRate">
          {{ torrent.downloadRate | calcTxRate }}
        </span>
      </div>
    </div>
    <div
      class="progress-bar"
      :style="{ width: percentDone(torrent.percentDone) }"
      :class="isDone ? 'done' : ''"
    ></div>
  </div>
</template>

<script>
export default {
  props: ["torrent"],

  methods: {
    percentDone: float => {
      return float * 100 + "%";
    }
  },

  computed: {
    isDone: function() {
      return this.torrent.percentDone == 1;
    }
  },

  filters: {
    calcTxRate: bps => {
      bps = parseInt(bps);
      if (bps < 1000) {
        return `${bps} bytes/s`;
      } else if (bps < 1000000) {
        return `${bps / 1000} kB/s`;
      } else {
        return `${bps / 1000000} MB/s`;
      }
    },

    toPercentage: float => {
      return float * 100 + "%";
    },

    cleanup: string => {
      return string.replace(/www\.(.+)\.(com|org|net) - /gi, "");
    }
  }
};
</script>

<style lang="scss">
.torrent {
  box-shadow: 0 2px rgba(grey, 0.5);
  margin: 15px;
  padding: 0.25em;
  padding-bottom: 0;
  font-size: 14px;
  border-radius: 7px;
  overflow: hidden;
  background: #2d2d38;

  .inner-container {
    padding: 0 0.5em;
  }

  p {
    margin: 0.25em 0;
  }

  .name {
    font-weight: bold;
    margin: 0.5em;
    line-height: 1.2;
    white-space: nowrap;
    width: 95%;
    overflow: hidden;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    color: lightgrey;
  }

  .progress-bar {
    display: block;
    height: 3px;
    position: relative;
    bottom: 0;
    left: 0;
    background-color: rgb(62, 179, 218);

    &.done {
      background-color: #2bca2b;
    }
  }
}
</style>
