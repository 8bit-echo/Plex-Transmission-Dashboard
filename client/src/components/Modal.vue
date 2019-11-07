<template>
  <div :class="{ modal: true, open: modalOpen }">
    <div
      ref="dialog"
      :class="{ dialog: true, open: modalOpen }"
    >
      <button
        class="exit"
        @click="hideDialog()"
      >&#215;</button>
      <div class="modal-content">
        {{ modalText }}
      </div>

      <div class="actions">
        <button @click="hideDialog()">Cancel</button>
        <button
          class="primary"
          @click="confirmAction()"
        >Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'Modal',

    computed: {
      ...mapState([
        'modalOpen', // boolean
        'modalText', // string
        'modalConfirm', // function
        'modalExtra' // any
      ])
    },

    methods: {
      ...mapMutations(['OPEN_MODAL', 'CLOSE_MODAL']),

      hideDialog() {
        this.CLOSE_MODAL();
      },

      /**
       * The modal is passed an action to perform on Confirm which is called before closing the dialog.
       */
      confirmAction() {
        this.modalConfirm();
        this.hideDialog();
      }
    }
  };
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
    background: #3b3b48;
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

    .actions {
      background: #2d2d38;
      display: flex;
      justify-content: space-around;

      button {
        width: 40%;
        font-family: 'Avenir', sans-serif;
        display: block;
        background-color: #3b3b48;
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
          background-color: #408fcf;
        }

        &.primary {
          background-color: #408fcf;
          &:active {
            background-color: darken(#408fcf, 10%);
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
      right: calc(100% - 68px);
      font-size: 34px;
      line-height: 0.75;
      background: transparent;
      border: none;
      outline: none;
    }
  }
</style>
