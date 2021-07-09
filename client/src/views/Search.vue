<template>
  <div class="search">
    <h1>Search</h1>
    <div class="input-container">
      <input
        ref="searchEl"
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

    <div class="search-results">
      <div class="section" v-for="(result, name) in results" :key="name">
        <h2 @click="toggle(name)">
          {{ capitalize(name) }}
          {{ visibleSections.includes(name) ? '–' : '+' }}
        </h2>

        <template v-if="visibleSections.includes(name)">
          <Torrent
            v-for="torrent in result"
            :key="torrent.id"
            :torrent="torrent"
          />
        </template>
      </div>
    </div>

    <button class="direct-add" @click="handleDirectAdd()">
      Add from magnet
    </button>
  </div>
</template>

<script lang="ts">
  import { post } from '../functions';
  import AppError from '../AppError';
  import { get } from '../functions';
  import Torrent from '../components/SearchTorrent.vue';
  import { ref, defineComponent } from 'vue';
  import { useFilters } from '../composables/useFilters';
  import { useModal } from '../composables/useModal';
  import { useNotifications } from '../composables/useNotifications';
  import { TorrentDashboard } from '../@types/index';
  /**
   * All the state in this view is self-contained.
   */
  export default defineComponent({
    name: 'Search',
    components: { Torrent },

    setup() {
      const searchTerm = ref('');
      const isLoading = ref(false);
      const msg = ref('');
      const results = ref<TorrentDashboard.SearchResults>({});
      const visibleSections = ref<string[]>([]);
      const searchEl = ref<HTMLInputElement>();

      const { openModal } = useModal();
      const { capitalize } = useFilters();
      const { displayNotification } = useNotifications();

      const doSearch = async () => {
        isLoading.value = true;
        searchEl.value?.blur();
        console.log(`searching for ${searchTerm.value}`);
        try {
          const response = await post('/search', { search: searchTerm.value });
          if (response.error || !response.success) {
            msg.value = response.error;
            new AppError(response.error);
          } else {
            results.value = response;
            visibleSections.value = Object.keys(response);
          }
          isLoading.value = false;
        } catch (error) {
          new AppError(error);
          msg.value = error.toString();
        }
      };

      const toggle = (key: string) => {
        if (visibleSections.value?.includes(key)) {
          visibleSections.value?.splice(
            visibleSections.value?.findIndex((el) => el === key),
            1
          );
        } else {
          visibleSections.value?.push(key);
        }
      };

      const handleDirectAdd = () => {
        console.log('click');
        openModal({
          msg: `Add torrent from magnet link`,
          extra: {
            isPrompt: true,
            placeholder: ' ',
          },
          action: async (magnet: string) => {
            try {
              const success = await get(`/torrent?magnet=${magnet}`);
              if (success) {
                displayNotification({
                  display: true,
                  level: 'okay',
                  message: 'Torrent queued for download',
                });
              } else {
                new AppError('Failed to add magnet Torrent');
              }
            } catch (error) {
              new AppError('Failed to add torrent to queue.');
            }
          },
        });
      };

      return {
        capitalize,
        doSearch,
        searchTerm,
        isLoading,
        msg,
        results,
        visibleSections,
        searchEl,
        toggle,
        handleDirectAdd,
      };
    },
  });
</script>

<style scoped lang="scss">
  .search {
    padding: 30px 0;
    padding-top: 120px;
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
    width: clamp(300px, 80vw, 600px);
    margin: auto;
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
    right: 1rem;
    top: 0;
    width: 20px;
    height: 20px;
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
    margin: 40px 10px;
    max-height: 66vh;
    overflow: scroll;
    padding-bottom: 65px;

    h2 {
      text-align: left;
    }
  }

  .toggle {
    color: rgba(white, 0.25);
  }

  .direct-add {
    background: #e5a00d;
    color: white;
    appearance: none;
    cursor: pointer;
    outline: none;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 1.5rem;
    font-size: 0.85rem;
    font-weight: bold;

    &:hover,
    &:active {
      filter: brightness(0.9);
    }
  }
</style>
