<template>
  <div class="home">
    <Search />
  </div>
</template>

<script>
  import Search from '@/components/Search.vue';

  export default {
    name: 'home',
    components: {
      Search
    }
  };
</script>

<style>
  .home {
    text-align: center;
    padding: 0 1rem;
    overflow: scroll;
    height: 100%;
  }
</style>
