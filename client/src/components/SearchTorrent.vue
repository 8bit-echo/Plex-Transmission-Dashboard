<template>
  <div
    class="torrent"
    @click="handleClick()"
  >
    <div class="inner-container">
      <p class="name">{{ torrent.name }}</p>
      <div class="meta">
        <span class="size">{{ torrent.size }}</span>
        <span class="seeds">
          <img
            src="../assets/seed.svg"
            width="10"
          />
          {{ torrent.seeds }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { get } from '../functions';
  import { mapMutations } from 'vuex';
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

    methods: {
      ...mapMutations(['OPEN_MODAL', 'DISPLAY_NOTIFICATION']),

      handleClick() {
        this.OPEN_MODAL({
          msg: `Start download  of ${this.torrent.name}?`,
          extra: {
            torrent: this.torrent,
            getMagnet: this.requiresExtraRequest
          },
          action: () => {
            this.confirmDownload();
          }
        });
      },

      confirmDownload() {
        // throw new Error('Failed to add torrent to queue');
        if (this.requiresExtraRequest) {
          get(`/magnet?link=${this.torrent.link}`)
            .then(success => {
              console.log(success);
              this.DISPLAY_NOTIFICATION({
                display: true,
                level: 'okay',
                message: 'Torrent queued for download'
              });
            })
            .catch(error => {
              console.log(error);
              this.DISPLAY_NOTIFICATION({
                display:true,
                level: 'error',
                message: 'Failed to add torrent to queue.'
              })
            });
        } else {
          console.log('no extra request reqd. adding directly.');
          get(`/torrent?magnet=${this.torrent.magnet}`)
            .then(success => {
                console.log(success);
                this.DISPLAY_NOTIFICATION({
                display: true,
                level: 'okay',
                message: 'Torrent queued for download'
              });
            }).catch(error => {
              console.log(error);
              this.DISPLAY_NOTIFICATION({
                display:true,
                level: 'error',
                message: 'Failed to add torrent to queue.'
              })
          });
        }
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
      word-break: break-all;
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
