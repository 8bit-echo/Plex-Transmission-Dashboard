<template>
  <div class="torrent" @click="handleClick()">
    <div class="inner-container">
      <p class="name">{{ torrent.name }}</p>
      <div class="meta">
        <span class="size">{{ torrent.size }}</span>
        <span class="seeds">
          <img src="../assets/seed-icon-alt.svg" width="15" />
          {{ torrent.seeds }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { get } from '../functions';
  import AppError from '../AppError';
  import { computed, defineComponent, toRef } from 'vue';
  import { useModal } from '../composables/useModal';
  import { useNotifications } from '../composables/useNotifications';

  export default defineComponent({
    props: ['torrent'],

    setup(props) {
      const { openModal } = useModal();
      const { displayNotification } = useNotifications();
      const torrent = toRef(props, 'torrent');
      const requiresExtraRequest = computed(
        () => !torrent.value.magnet && !!torrent.value.link
      );

      /**
       * Passes all relevant data to a confirmation modal, including the function that is run upon confimation.
       * If a torrent requires an extra request, the server will take care of it and automatically add it to the queue from the back-end.
       */
      const handleClick = () => {
        openModal({
          msg: `Start download  of ${torrent.value.name}?`,
          extra: {
            torrent: torrent.value,
            getMagnet: requiresExtraRequest.value,
          },
          action: () => {
            confirmDownload();
          },
        });
      };

      /**
       * The action required to finish adding a torrent to the queue after confirming in the modal.
       *  defining the action as a method ensures that the context stays within the scope of this component's data.
       */
      const confirmDownload = async () => {
        if (requiresExtraRequest.value) {
          try {
            const { success } = await get(`/magnet?link=${torrent.value.link}`);
            console.log(success);
            if (success) {
              displayNotification({
                display: true,
                level: 'okay',
                message: 'Torrent queued for download',
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
              `/torrent?magnet=${torrent.value.magnet}`
            );
            console.log(success);
            displayNotification({
              display: true,
              level: 'okay',
              message: 'Torrent queued for download',
            });
          } catch (error) {
            console.log(error);
            new AppError('Failed to add torrent to queue.');
          }
        }
      };

      return {
        torrent,
        requiresExtraRequest,
        handleClick,
        confirmDownload,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .torrent {
    box-shadow: 0 2px rgba(grey, 0.5);
    padding: 1.25em 0.25em;
    padding-bottom: 0;
    font-size: 14px;
    overflow: hidden;
    background: transparent;

    &:nth-child(odd) {
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
