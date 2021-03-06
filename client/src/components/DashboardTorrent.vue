<template>
  <div
    :class="['torrent', { selected: selected, paused: torrent.status == 0 }]"
    @click="select(torrent)"
  >
    <div class="inner-container">
      <p class="name">{{ torrent.name | cleanup }}</p>
      <div class="meta">
        {{ torrent.percentDone | toPercentage }} of
        {{ torrent.sizeWhenDone | toHuman }}
        <span
          class="download-rate"
          v-if="torrent.rateDownload"
        >
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
  import { mapMutations } from 'vuex';
  export default {
    props: ['torrent', 'selected'],

    computed: {
      isDone: function() {
        return this.torrent.percentDone == 1;
      }
    },

    filters: {
      /**
       * converts number of bytes to human readable format
       */
      toHuman: bytes => {
        if (!bytes) {
          return 'unknown';
        }
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (
          (bytes / Math.pow(1024, i)).toFixed(2) * 1 +
          ' ' +
          ['B', 'kB', 'MB', 'GB', 'TB'][i]
        );
      },

      toPercentage: float => {
        return (float * 100).toFixed(2) + '%';
      },

      /**
       * removes a bunch of the garbage strings from torrent names. far from perfect.
       **/
      cleanup: string => {
        return string
          .replace(
            /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(aac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray)|(dvd(rip)?)|(DL)|(DD\+\d( \d)?))|(xvid)/gi,
            ''
          )
          .replace(
            /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt)|(yts\.am)|(rarbg)|(AMZN)|(metcon)|(red dawn)|(AMRAP)|(Slashdance)|(AJP69)|(Red\.Dawn)|(qman)|(tbs)|(freethefish))/gi,
            ''
          )
          .replace(/(mkv)|(avi)|(mp4)/gi, '')
          .replace(/(\(\))|(\[\])|(\.\d)/gi, '')
          .replace(/\./g, ' ');
      }
    },

    methods: {
      ...mapMutations(['TORRENT_SELECTED']),

      /**
       * Converts to a css-friendly percentage string
       */
      percentDone(float) {
        return float * 100 + '%';
      },

      /**
       * highlight a torrent
       */
      select(torrent) {
        this.TORRENT_SELECTED(torrent);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .torrent {
    box-shadow: 0 0 2px rgba(white, 0.25);
    margin: 15px;
    padding-bottom: 0;
    font-size: 14px;
    overflow: hidden;
    position: relative;
    border: solid 1px transparent;

    &:nth-child(odd) {
      background-color: rgba(255, 255, 255, 0.05);
    }

    &:hover {
      background-color: rgba(white, 0.1);
    }

    &.selected {
      border: solid 1px #cc7b19;
    }

    &.paused {
      filter: grayscale(1);
      opacity: 0.5;
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
      text-align: left;
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
      background-color: #cc7b19;

      &.done {
        $flag-size: 25px;
        $offset: $flag-size / 2;
        justify-self: flex-end;
        position: absolute;
        background-color: #cc7b19;
        height: $flag-size;
        width: $flag-size !important;
        top: -1 * $offset;
        left: calc(100% - #{$offset});
        transform: rotate(45deg);
      }
    }
  }
</style>
