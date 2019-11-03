<template>
  <div class="home">
    <Search />
  </div>
</template>

<script>
// @ is an alias to /src
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
}
</style>
