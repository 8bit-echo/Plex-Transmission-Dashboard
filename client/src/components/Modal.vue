<template>
  <div :class="{ modal: true, open: modalOpen }">
    <div ref="dialog" :class="{ dialog: true, open: modalOpen }">
      <button class="exit" @click="hideDialog()">&#215;</button>
      <div class="modal-content">
        {{ modalText }}
      </div>

      <div class="actions">
        <button @click="hideDialog()">Cancel</button>
        <button class="primary" @click="confirmAction()">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from '../functions';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Modal',

  data() {
    return {
      msg: '',
      isOpen: false,
      torrent: null,
      getMagnet: false,
      handleConfirm: () => {
        if (this.getMagnet) {
          get(`/magnet?link=${this.torrent.link}`).then(success => {
            console.log(success);
          });
        } else {
          console.log('no extra request reqd. adding directly.');
          get(`/torrent?magnet=${this.torrent.magnet}`).then(success => {
            console.log(success);
          });
        }
      }
    };
  },

  computed: {
    ...mapState(['modalOpen', 'modalText'])
  },

  methods: {
    ...mapMutations(['OPEN_MODAL', 'CLOSE_MODAL']),

    showDialog() {
      this.OPEN_MODAL(true);
    },

    hideDialog() {
      this.CLOSE_MODAL();
    },

    confirmAction() {
      this.handleConfirm();
      this.hideDialog();
    }
  },

  mounted() {
    // this.$parent.$on('openModal', payload => {
    //   this.msg = payload.msg;
    //   this.getMagnet = payload.getMagnet;
    //   this.torrent = payload.torrent;
    //   if (typeof payload.handleConfirm == 'function') {
    //     this.handleConfirm = payload.handleConfirm;
    //   }
    //   this.showDialog();
    // });
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
    left: 0;
    font-size: 34px;
    line-height: 0.75;
    background: transparent;
    border: none;
    outline: none;
  }
}
</style>
