<template>
  <div
    :class="[
      'notification',
      notificationType,
      { hasGlobal: !!globalNotification },
    ]"
    ref="notification"
  >
    <div class="notification-container">
      {{ notificationText }}
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { setStatusBarColor } from '../functions';
  import { useNotifications } from '../composables/useNotifications';

  export default defineComponent({
    setup() {
      const {
        notificationType,
        notificationText,
        globalNotification,
        displayNotification,
      } = useNotifications();

      const drag = ref(false);
      const touchStart = ref(0);
      const touchEnd = ref(0);
      const notification = ref<HTMLDivElement>();

      const touchDirection = computed(() => {
        if (touchStart.value === touchEnd.value) return 'none';
        return touchStart.value > touchEnd.value ? 'up' : 'down';
      });

      const touchDelta = computed(() => touchEnd.value - touchStart.value);

      const handleDown = (e: TouchEvent) => {
        e.preventDefault();
        touchStart.value = e.touches[0].screenY;
        drag.value = true;
        if (notification.value) notification.value.style.transition = 'none';
      };

      const handleMove = (e: TouchEvent) => {
        e.preventDefault();
        if (drag.value) {
          touchEnd.value = e.touches[0].screenY;
          if (notification.value)
            notification.value.style.top = `${touchDelta.value}px`;
          if (
            notification.value &&
            touchDirection.value === 'up' &&
            Math.abs(touchDelta.value) >= 0.55 * notification.value.scrollHeight
          ) {
            dismissNotification();
          }
        }
      };

      const dismissNotification = () => {
        if (notification.value) {
          notification.value.style.top = '-110px';
          setStatusBarColor();
          displayNotification({ display: false });
        }
      };

      const handleUp = (e: TouchEvent) => {

        e.preventDefault();
        drag.value = false;
        if (notification.value) { 
          notification.value.style.transition = 'top 250ms ease-in';
        }
      };

      onMounted(() => {
        if (notification.value) {
          // have to register events like this because Safari is trash, but I have an iPhone.
          notification.value.addEventListener('touchstart', handleDown, false);

          notification.value.addEventListener('touchmove', handleMove, false);

          notification.value.addEventListener('touchend', handleUp, false);
        }
      });

      return {
        notificationType,
        notificationText,
        globalNotification,
        notification,
        handleDown,
      };
    },
  });
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

    // iPhone X
    // apparently the notch height is 100vh - 44px
    @media screen and (width: 375px) and (height: 768px) {
      padding-top: 40px;
    }
  }
</style>