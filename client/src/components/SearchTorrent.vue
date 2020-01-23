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
            src="../assets/seed-icon-alt.svg"
            width="15"
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
  import AppError from '@/AppError';
  export default {
    props: ['torrent'],

    computed: {
      /**
       * due to the nature of web-scraping torrent websites, some torrents require navigating to another page in order to see the magnet link. if that's true, the torrent requires another HTTP request.
       */
      requiresExtraRequest() {
        return !this.torrent.magnet && !!this.torrent.link;
      }
    },

    methods: {
      ...mapMutations(['OPEN_MODAL', 'DISPLAY_NOTIFICATION']),

      /**
       * Passes all relevant data to a confirmation modal, including the function that is run upon confimation.
       * If a torrent requires an extra request, the server will take care of it and automatically add it to the queue from the back-end.
       */
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

      /**
       * The action required to finish adding a torrent to the queue after confirming in the modal.
       *  defining the action as a method ensures that the context stays within the scope of this component's data.
       */
      async confirmDownload() {
        if (this.requiresExtraRequest) {
          try {
            const { success } = await get(`/magnet?link=${this.torrent.link}`);
            console.log(success);
            if (success) {
              this.DISPLAY_NOTIFICATION({
                display: true,
                level: 'okay',
                message: 'Torrent queued for download'
              });
            } else {
              new AppError('Failed to add torrent to queue.'); 
            }
          } catch (error) {
            console.log(error);
            new AppError('Failed to add torrent to queue.');
          }
        } else {
          console.log('no extra request reqd. adding directly.');
          try {
            const { success } = await get(
              `/torrent?magnet=${this.torrent.magnet}`
            ).then(success => {
              console.log(success);
              this.DISPLAY_NOTIFICATION({
                display: true,
                level: 'okay',
                message: 'Torrent queued for download'
              });
            });
          } catch (error) {
            console.log(error);
            new AppError('Failed to add torrent to queue.');
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .torrent {
    box-shadow: 0 2px rgba(grey, 0.5);
    padding: 1.25em 0.25em;
    padding-bottom: 0;
    font-size: 14px;
    overflow: hidden;
    background: transparent;

    &:nth-child(odd){
      background-color: rgba(white, 0.05);
    }

    &:hover {
      background-color: rgba(white, 0.1);
    }

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
