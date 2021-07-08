<template>
  <div :class="{ modal: true, open: modalOpen, prompt: isPrompt }">
    <div ref="dialog" :class="{ dialog: true, open: modalOpen }">
      <button class="exit" @click="closeModal()">&#215;</button>
      <div class="modal-content">
        {{ modalText }}
      </div>

      <template v-if="isPrompt">
        <input
          type="text"
          v-model="prompt"
          class="prompt"
          autofocus="true"
          :placeholder="
            modalExtra.placeholder ? modalExtra.placeholder : 'Name of TV Show'
          "
        />
      </template>

      <div class="actions">
        <button @click="closeModal()">Cancel</button>
        <button class="primary" @click="confirmAction()">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { useModal } from '../composables/useModal';
  export default defineComponent({
    name: 'Modal',

    setup() {
      const {
        modalOpen,
        modalText,
        modalConfirm,
        modalExtra,
        openModal,
        closeModal,
      } = useModal();

      const prompt = ref('');
      const isPrompt = computed(
        () => modalExtra.value && modalExtra?.value.isPrompt
      );

      /**
       * The modal is passed an action to perform on Confirm which is called before closing the dialog.
       */
      const confirmAction = () => {
        if (prompt.value) { 
          isPrompt.value ? modalConfirm.value(prompt.value) : modalConfirm.value();
        prompt.value = '';
        closeModal();
        }
      };

      return {
        modalOpen,
        modalText,
        modalConfirm,
        modalExtra,
        openModal,
        closeModal,
        isPrompt,
        prompt,
        confirmAction,
      };
    },
  });
</script>

<style lang="scss">
  .modal {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;

    &.open {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.75);
    }
  }
  .dialog {
    // background: #3b3b48;
    background: #1f2326;
    color: white;
    border: none;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.75);
    padding: 0;
    top: 50%;
    transform: translateY(-50%);
    min-width: 66%;
    position: relative;
    display: none;
    margin: 0 15px;

    &.open {
      display: block;
    }

    .modal-content {
      padding: 40px 2rem 2rem;
      text-align: left;
    }

    .prompt {
      width: 95%;
      margin: 1rem auto;
      font-size: 1rem;
      padding: 0.5rem;
      text-align: center;
      background-color: darken(#1f2326, 5%);
      color: white;
      border: none;
      outline: none;
    }

    .actions {
      background: darken(#1f2326, 2.5%);
      display: flex;
      justify-content: space-around;

      button {
        width: 40%;
        font-family: 'Avenir', sans-serif;
        display: block;
        background-color: lighten(#1f2326, 5%);
        color: white;
        border-radius: 5px;
        font-size: 1rem;
        padding: 1rem;
        margin: 1rem auto;
        border: none;
        outline: none;
        box-shadow: 0 0 8px rgba(16, 10, 39, 0.5);
        display: flex;
        justify-content: space-around;
        align-items: center;

        &:active {
          background-color: #cc7b19;
        }

        &.primary {
          background-color: #cc7b19;
          &:active {
            background-color: darken(#cc7b19, 10%);
          }
        }
      }
    }

    &::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }

    .exit {
      color: indianred;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 34px;
      line-height: 0.75;
      background: transparent;
      border: none;
      outline: none;
    }
  }
</style>
