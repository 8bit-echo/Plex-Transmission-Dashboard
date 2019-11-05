<template>
  <div
    v-show="notificationVisible"
    :class="['notification', notificationType]"
    ref="notification"
  >
    <div class="notification-container">
      {{ notificationText }}
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  export default {
    data() {
      return {
        drag: false,
        touchStart: 0,
        touchEnd: 0
      };
    },

    computed: {
      ...mapState([
        'notificationVisible',
        'notificationType',
        'notificationText'
      ]),
      touchDirection() {
        if (this.touchStart === this.touchEnd) {
          return 'none';
        }
        return this.touchStart > this.touchEnd ? 'up' : 'down';
      },

      touchDelta() {
        return this.touchEnd - this.touchStart;
      }
    },

    methods: {
      ...mapMutations(['DISPLAY_NOTIFICATION']),
      handleDown(e) {
        e.preventDefault();
        this.touchStart = e.touches['0'].screenY;
        this.drag = true;
      },
      handleMove(e) {
        e.preventDefault();
        if (this.drag) {
          this.touchEnd = e.touches['0'].screenY;

          if (this.touchDirection === 'up') {
            this.$refs.notification.style.top = `${this.touchDelta}px`;

            if (
              Math.abs(this.touchDelta) >=
              0.55 * this.$refs.notification.scrollHeight
            ) {
              this.dismissNotification();
            }
          }
        }
      },
      handleUp(e) {
        e.preventDefault();
        this.drag = false;
      },

      dismissNotification() {
        this.$refs.notification.style.top = '-100px';
        this.$refs.notification.style.display = 'none';
        document.documentElement.style.setProperty('--topBarColor', '#3b3b48');
        this.DISPLAY_NOTIFICATION(false);
      }
    },

    mounted() {
      this.$refs.notification.addEventListener(
        'touchstart',
        this.handleDown,
        false
      );
      this.$refs.notification.addEventListener(
        'touchmove',
        this.handleMove,
        false
      );
      this.$refs.notification.addEventListener('touchend', this.handleUp, false);
    },

    watch: {
      notificationVisible(newVal) {
        if (newVal) {
          this.$refs.notification.style.top = '0';
          this.$refs.notification.style.display = 'block';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .notification {
    width: 100%;
    padding: 1rem 0;
    top: 0;
    position: fixed;
    z-index: 5;
    box-shadow: 0 0 5px rgba(black, 5%);
    background-color: cornflowerblue;
    color: white;

    &.error {
      background-color: orangered;
      color: white;
    }

    &.warning {
      background-color: #ffe96f;
      color: black;
    }

    .notification-container {
      padding: 0.75rem 1rem 0.25rem;
    }
  }
</style>