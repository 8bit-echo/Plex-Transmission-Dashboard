<template>
  <div class="search">
    <h1>Search</h1>
    <div class="input-container">
      <input
        name="search"
        type="text"
        autocomplete="false"
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

    <div class="search-results">
      {{ msg }}
    </div>
  </div>
</template>

<script>
import { post } from '../functions';
export default {
  name: 'Search',
  data() {
    return {
      searchTerm: '',
      isLoading: false,
      msg: ''
    };
  },

  methods: {
    doSearch() {
      this.isLoading = true;
      console.log(`searching for ${this.searchTerm}`);
      post('/search', { search: this.searchTerm })
        .then(response => {
          this.msg = response.key;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.msg = error.toString();
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search {
  padding-top: 30px;
}

h1 {
  margin: 0 auto;
}
a {
  color: #42b983;
}

.input-container {
  position: relative;
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
}
</style>
