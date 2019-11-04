<template>
  <div v-show="showing"
    class="notification warning"
    ref="notification"
  >
    <div class="notification-container">
      I am notification texts.
    </div>
  </div>
</template>

<script>
  import { deviceType } from '@/functions.js';
  export default {
    data() {
      return {
        showing: false,
        drag: false,
        touchStart: 0,
        touchEnd: 0
      };
    },

    computed: {
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
        console.log('dismissing notification');
        this.$refs.notification.style.top = '-100px';
        this.$refs.notification.style.display = 'none';
        document.documentElement.style.setProperty('--topBarColor', '#3b3b48');
        this.showing = false;
      }
    },

    mounted() {
      if (deviceType() === 'iPhone X') {
        this.$refs.notification.style.paddingTop = '40px';
        // document.documentElement.style.setProperty('--topBarColor', '#ffe96f');
      }

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

    &.offline {
      background-color: cornflowerblue;
      color: white;
    }

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