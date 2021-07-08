import { computed } from 'vue';
import { Mutations } from '../constants';
import { store } from '../store';

const useModal = () => {
  const modalOpen = computed(() => store.state.modalOpen);
  const modalText = computed(() => store.state.modalText);
  const modalConfirm = computed(() => store.state.modalConfirm);
  const modalExtra = computed(() => store.state.modalExtra);

  const openModal = (payload: any) => {
    store.commit(Mutations.openModal, payload);
  };

  const closeModal = () => {
    store.commit(Mutations.closeModal);
  };

  return {
    modalOpen,
    modalText,
    modalConfirm,
    modalExtra,
    openModal,
    closeModal,
  };
};

export { useModal };
