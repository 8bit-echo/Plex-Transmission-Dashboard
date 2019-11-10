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

      <button v-if="searchTerm" class="clear" @click.prevent="searchTerm = ''">
        &#10006;
      </button>
      <img
        class="spinner"
        v-if="isLoading"
        src="../assets/spinner.svg"
        alt="loading..."
      />
    </div>

    {{ dimensions }}

    <div class="search-results">
      <h2 v-if="zooqle_torrents.length">
        Zooqle
        <span class="toggle" @click="toggleZooqle()">
          {{ zooqleShow ? '&ndash;' : '+' }}
        </span>
      </h2>

      <template v-if="zooqleShow">
        <Torrent
          v-for="torrent in zooqle_torrents"
          :key="torrent.id"
          :torrent="torrent"
        />
      </template>

      <h2 v-if="one337x_torrents.length">
        1337x
        <span class="toggle" @click="toggle1337x()">
          {{ one337xShow ? '&ndash;' : '+' }}
        </span>
      </h2>

      <template v-if="one337xShow">
        <Torrent
          v-for="torrent in one337x_torrents"
          :key="torrent.id"
          :torrent="torrent"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import { post } from '../functions';
  import Torrent from './SearchTorrent';
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
        zooqle_torrents: [],
        one337x_torrents: [],
        zooqleShow: true,
        one337xShow: true
      };
    },
    computed: {
      dimensions() {
        return `${window.innerWidth} x ${window.innerHeight}`;
      }
    },

    methods: {
      doSearch() {
        this.isLoading = true;
        this.$refs.search.blur();
        console.log(`searching for ${this.searchTerm}`);
        post('/search', { search: this.searchTerm })
          .then(response => {
            this.isLoading = false;
            if (response.error) {
              this.msg = response.error;
            } else {
              this.zooqle_torrents = response.zooqle.sort(
                (a, b) => parseInt(a.seeds) > parseInt(b.seeds)
              );
              this.one337x_torrents = response._1337x;
            }
          })
          .catch(error => {
            console.log(error);
            this.msg = error.toString();
          });
      },

      toggleZooqle() {
        this.zooqleShow = !this.zooqleShow;
      },

      toggle1337x() {
        this.one337xShow = !this.one337xShow;
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
    color: #42b983;
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
      border-color: #42b983;
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
