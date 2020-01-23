<template>
  <div class="search">
    <h1>Search</h1>
    <div class="input-container">
      <input
        ref="search"
        name="search"
        type="text"
        autofocus="true"
        spellcheck="false"
        v-model="searchTerm"
        @keyup.enter="doSearch()"
      />

      <button
        v-if="searchTerm"
        class="clear"
        @click.prevent="searchTerm = ''"
      >
        &#10006;
      </button>
      <img
        class="spinner"
        v-if="isLoading"
        src="../assets/spinner.svg"
        alt="loading..."
      />
    </div>

    <div class="search-results">

      <template
        class="section"
        v-for="(result, name) in results"
      >
        <h2
          :key="name"
          @click="toggle(name)"
        >
          {{name | capitalize() }} {{visibleSections.includes(name) ? '–' : '+'}}
        </h2>

        <template v-if="visibleSections.includes(name)">
          <Torrent
            v-for="torrent in result"
            :key="torrent.id"
            :torrent="torrent"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import { post } from '../functions';
  import Torrent from './SearchTorrent';
  import AppError from '@/AppError';
  /**
   * All the state in this view is self-contained.
   */
  export default {
    name: 'Search',
    components: { Torrent },

    data() {
      return {
        searchTerm: '',
        isLoading: false,
        msg: '',
        results: null,
        visibleSections: []
      };
    },
    computed: {
      dimensions() {
        return `${window.innerWidth} x ${window.innerHeight}`;
      }
    },

    filters: {
      capitalize(string) {
        string = string[0].toUpperCase() + string.slice(1);
        return string.replace(/_/g, '');
      }
    },

    methods: {
      async doSearch() {
        this.isLoading = true;
        this.$refs.search.blur();
        console.log(`searching for ${this.searchTerm}`);
        try {
          const response = await post('/search', { search: this.searchTerm });
          if (response.error) {
            this.msg = response.error;
            new AppError(response.error);
          } else {
            this.results = response;
            this.visibleSections = Object.keys(response);
          }
          this.isLoading = false;
        } catch (error) {
          new AppError(error);
          this.msg = error.toString();
        }
      },

      toggle(key) {
        if (this.visibleSections.includes(key)) {
          this.visibleSections.splice(
            this.visibleSections.findIndex(el => el === key),
            1
          );
        } else {
          this.visibleSections.push(key);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .search {
    padding: 30px 0;
    padding-top: 45px;
  }

  h1 {
    margin: 0 auto;
  }
  a {
    color: #e5a00d;
  }

  .input-container {
    position: relative;
    padding: 0 1rem;
  }

  input[type='text'] {
    background: transparent;
    border: none;
    outline: none;
    border-bottom: solid 2px;
    border-color: grey;
    width: 100%;
    color: #f3f3f3;
    text-align: center;
    font-size: 1.5rem;
    transition: 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335);

    &:focus {
      border-color: #e5a00d;
      transition: 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
    }
  }

  button.clear {
    display: inline-block;
    position: absolute;
    background: rgba(white, 0.25);
    color: #3b3b48;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 100%;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    appearance: none;
    outline: none;
    border: none;
  }

  img.spinner {
    width: 50px;
    margin: 1rem auto;
  }

  .search-results {
    margin-top: 40px;

    h2 {
      text-align: left;
    }
  }

  .toggle {
    color: rgba(white, 0.25);
  }
</style>
