<template>
  <div

    :class="['notification', notificationType, {hasGlobal: globalNotification !== false}]"
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
        'notificationText',
        'globalNotification'
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
        this.$refs.notification.style.transition = 'none';
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
        this.$refs.notification.style.transition = 'top 250ms ease-in';
      },

      dismissNotification() {
        this.$refs.notification.style.top = '-100px';
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
        } else {
          this.$refs.notification.style.top = '-100px';
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .notification {
    width: 100%;
    padding: 1rem 0;
    top: -100px;
    position: fixed;
    z-index: 5;
    box-shadow: 0 0 5px rgba(black, 5%);
    background-color: cornflowerblue;
    color: white;
    transition: top 250ms ease-in;


    &.okay {
      background-color: #42b983;
      color: black;
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