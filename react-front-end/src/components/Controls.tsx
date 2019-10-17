import React, { useEffect } from 'react';
import { useGlobalState } from '../State';
import classNames from 'classnames';
import spinnerImage from '../assets/spinner.svg';
import plexIcon from '../assets/plextv-icon.svg';
import './styles/controls.scss';
import { get } from '../functions';

export default function Controls() {
  const [state, dispatch] = useGlobalState();
  const disabled = !!(state.selectedTorrent <= 0);
  const playPauseText = 'Play';

  useEffect(() => {
    get('/vpn-status').then(res => {
      dispatch({ type: 'SET_VPN_STATUS', payload: res.status });
    });
  }, []);

  return (
    <div
      className="controls"
      onClick={e => {
        console.log('ctrls click');
        e.stopPropagation();
        dispatch({ type: 'DESELECT_TORRENT' });
      }}
    >
      <div className="status-bar">
        <div className="vpnStatus indicator">
          VPN
          <div
            className={classNames('statusLight', {
              active: state.vpnStatus === 'ACTIVE'
            })}
          ></div>
        </div>
        {state.isLoading ? (
          <div className="loading-indicator indicator">
            <img src={spinnerImage} width="25" alt="loading" />
          </div>
        ) : null}
      </div>
      <button
        onClick={() => {
          // toggleVPN();
        }}
      >
        Toggle VPN
      </button>
      <button
        onClick={() => {
          // getTVFolder();
        }}
        disabled={disabled}
      >
        Move to TV Shows
        <img src={plexIcon} width="25" alt="plex icon" />
      </button>
      <button
        onClick={() => {
          // moveMovie();
        }}
        disabled={disabled}
      >
        Move to Movies
        <img src={plexIcon} width="25" alt="plex icon" />
      </button>

      {disabled ? null : (
        <button
          disabled={disabled}
          onClick={() => {
            // handleStartStop();
          }}
        >
          {playPauseText}
        </button>
      )}

      {disabled ? null : (
        <button
          onClick={() => {
            // removeFromList(selectedTorrent);
          }}
          className="danger"
        >
          Remove
        </button>
      )}
    </div>
  );
}
