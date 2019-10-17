import React, { Reducer } from 'react';
import './App.scss';
import { StateProvider } from './State';
import Controls from './components/Controls';
import Transmission from './components/Transmission';
import Modal from './components/Modal';

const initialState: AppState = {
  torrents: [],
  selectedTorrent: -1,
  vpnStatus: 'INACTIVE',
  isLoading: false
};

function App() {
  const reducer: Reducer<AppState, Action> = (
    state: AppState,
    action: Action
  ) => {
    switch (action.type) {
      case 'SELECT_TORRENT':
        return {
          ...state,
          ...{ selectedTorrent: action.payload }
        };
      
      case 'DESELECT_TORRENT':
          return {
            ...state,
            ...{selectedTorrent: -1}
          }

      case 'GOT_TORRENTS': 
        return {
          ...state,
          ...{torrents: action.payload}
        };

      case 'SET_VPN_STATUS': 
        return {
          ...state,
          ...{vpnStatus: action.payload}
        }

      default:
        return state;
    }
  };

  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <div className="App">
        <div className="container">
          <Controls />
          <Transmission />
        </div>
        <Modal />
      </div>
    </StateProvider>
  );
}

export default App;
