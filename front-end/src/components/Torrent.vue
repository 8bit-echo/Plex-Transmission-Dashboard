<template>
  <div :class="{ torrent: true, selected: selected }" @click="select(torrent)">
    <div class="inner-container">
      <p class="name">{{ torrent.name | cleanup }}</p>
      <div class="meta">
        {{ torrent.percentDone | toPercentage }} of
        {{ torrent.sizeWhenDone | toHuman }}
        <span class="download-rate" v-if="torrent.rateDownload">
          ↓ {{ torrent.rateDownload | toHuman }}/s
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
import { AppState } from '../AppState';
export default {
  props: ['torrent', 'selected'],

  data() {
    return {
      // selected: false,
    };
  },

  computed: {
    isDone: function() {
      return this.torrent.percentDone == 1;
    }
  },

  filters: {
    toHuman: bytes => {
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (
        (bytes / Math.pow(1024, i)).toFixed(2) * 1 +
        ' ' +
        ['B', 'kB', 'MB', 'GB', 'TB'][i]
      );
    },

    toPercentage: float => {
      return float * 100 + '%';
    },

    cleanup: string => {
      return string
        .replace(
          /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(aac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray))/gi,
          ''
        )
        .replace(
          /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt))/gi,
          ''
        )
        .replace(/(\(\))|(\[\])/gi, '');
    }
  },

  methods: {
    percentDone: float => {
      return float * 100 + '%';
    },

    select(torrent) {
      AppState.$emit('torrentSelect', torrent);
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

  &.selected {
    box-shadow: 0 0 10px rgba(white, 0.5);
  }

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
