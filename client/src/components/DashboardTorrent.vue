<template>
  <div
    :class="['torrent', { selected: selected, paused: torrent.status == 0 }]"
    @click="select(torrent)"
  >
    <div class="inner-container">
      <p class="name">{{ cleanup(torrent.name) }}</p>
      <div class="meta">
        {{ toPercentage(torrent.percentDone) }} of
        {{ toHuman(torrent.sizeWhenDone) }}
        <span class="download-rate" v-if="torrent.rateDownload">
          ↓ {{ toHuman(torrent.rateDownload) }}/s
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

<script lang="ts">
  import { computed, defineComponent, toRefs } from 'vue';
  import { useTorrents } from '../composables/useTorrents';
  import { useFilters } from '../composables/useFilters';

  export default defineComponent({
    props: ['torrent', 'selected'],

    setup(props) {
      const { torrent, selected } = toRefs(props);
      const { select } = useTorrents();
      const { cleanup, toPercentage, toHuman } = useFilters();

      const isDone = computed(() => Number(torrent.value.percentDone) === 1);

      const percentDone = (float: number) => {
        return `${float * 100}%`;
      };

      return {
        isDone,
        selected,
        torrent,
        select,
        percentDone,
        cleanup,
        toPercentage,
        toHuman,
      };
    },
  });
</script>

<style lang="scss" scoped>
  @use "sass:math";
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
        $offset: math.div($flag-size, 2);
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
