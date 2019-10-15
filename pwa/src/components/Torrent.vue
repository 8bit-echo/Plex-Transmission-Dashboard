<template>
  <div class="torrent" @click="handleClick()">
    <div class="inner-container">
      <p class="name">{{ torrent.name }}</p>
      <div class="meta">
        <span class="size">{{ torrent.size }}</span>
        <span class="seeds">
          <img src="../assets/seed.svg" width="10" />
          {{ torrent.seeds }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['torrent'],

  data() {
    return {};
  },

  computed: {
    requiresExtraRequest() {
      return !this.torrent.magnet && !!this.torrent.link;
    }
  },

  filters: {
    cleanup: string => {
      return string
        .replace(
          /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(a?ac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray)|(dvd(rip)?))/gi,
          ''
        )
        .replace(
          /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt)|(yts\.am)|(rarbg))/gi,
          ''
        )
        .replace(/(mkv)|(avi)|(mp4)/gi, '')
        .replace(/(\(\))|(\[\])/gi, '')
        .replace(/\./g, ' ');
    }
  },

  methods: {
    handleClick() {
      this.$parent.$emit('torrentSelected', {
        torrent: this.torrent,
        msg: `Start download  of ${this.torrent.name}?`,
        getMagnet: this.requiresExtraRequest
      });
    }
  }
};
</script>

<style lang="scss">
.torrent {
  box-shadow: 0 2px rgba(grey, 0.5);
  margin: 15px 0;
  padding: 0.25em;
  padding-bottom: 0;
  font-size: 14px;
  border-radius: 7px;
  overflow: hidden;
  background: #2d2d38;

  &.selected {
    box-shadow: 0 0 10px rgba(white, 0.5);
  }

  &.paused {
    filter: grayscale(1);
  }

  .inner-container {
    padding: 0 0.5em;
    display: flex;
    justify-content: space-between;
  }

  p {
    margin: 0.25em 0;
  }

  .name {
    font-weight: bold;
    margin: 0.5em;
    line-height: 1.2;
    width: 58%;
    overflow: hidden;
    text-align: left;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: lightgrey;
    width: 33%;

    > * {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin: 0 7px;
      }
    }
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
