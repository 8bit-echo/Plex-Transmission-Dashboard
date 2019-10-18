import React, { useEffect } from 'react';
import { useGlobalState } from '../State';
import classNames from 'classnames';
import spinnerImage from '../assets/spinner.svg';
import plexIcon from '../assets/plextv-icon.svg';
import './styles/controls.scss';
import { get, post, _delete } from '../functions';

export default function Controls() {
  const [state, dispatch] = useGlobalState();
  const disabled = !state.selectedTorrent;
  const playPauseText = 'Stop';

  useEffect(() => {
    get('/vpn-status').then(res => {
      dispatch({ type: 'SET_VPN_STATUS', payload: res.status });
    });

    setInterval(() => {
      get('/vpn-status').then(res => {
        dispatch({ type: 'SET_VPN_STATUS', payload: res.status });
      });
    }, 60000);
  }, [dispatch]);

  const toggleVPN = () => {
    let action;
    if (state.vpnStatus === 'ACTIVE') {
      action = 'stop';
    } else {
      action = 'start';
    }

    post('/vpn', { action }).then(response => {
      if (response.success) {
        console.log(`vpn start: success`);
        get('/vpn-status').then(result => {
          dispatch({ type: 'SET_VPN_STATUS', payload: result.status });
        });
      }
    });
  };

  const openModal = () => {
    dispatch({ type: 'OPEN_MODAL', payload: { msg: 'Start torrent' } });
  };

  const getTVFolder = () => {
    // const self = state;
    post('/guess-tv-show', { torrentName: state.selectedTorrent.name }).then(
      response => {
        const { show, season, error } = response;
        const msg = `Move to ${show} - ${season} folder?`;

        console.log(msg);
        if (error) {
          // handle error ?
        }

        dispatch('openModal', {
          msg,
          show,
          season,
          handleConfirm: () => {
            moveTVShow(state.selectedTorrent, show, season);
          }
        });
      }
    );
  };

  const moveMovie = () => {
    state.isLoading = true;
    post('/move-movie', state.selectedTorrent).then(response => {
      console.log(response);

      if (response.success) {
        removeFromList(state.selectedTorrent);
      }
    });
  };

  const moveTVShow = (
    torrent: TorrentType,
    show: string,
    season: string | number
  ) => {
    state.isLoading = true;
    console.log('Controls will move TV Show');
    console.log(torrent, show, season);
    post('/move-tv-show', { torrent, show, season }).then(response => {
      if (response.success) {
        removeFromList(state.selectedTorrent);
      }
    });
  };

  const removeFromList = (torrent: TxTorrent) => {
    state.isLoading = true;
    _delete('/torrents', { id: torrent.id }).then(response => {
      console.log('removing torrents from list.');
      console.log(response);

      dispatch('torrentListShouldChange');
      state.isLoading = false;
    });
  };

  const handleStartStop = () => {
    post('/pause', {
      id: state.selectedTorrent.id,
      action: playPauseText.toLowerCase()
    }).then(response => {
      console.log(`start/stop response`, response);
      dispatch('torrentListShouldChange');
    });
  };

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
      <button onClick={toggleVPN}>Toggle VPN</button>
      <button
        onClick={() => {
          getTVFolder();
        }}
        disabled={disabled}
      >
        Move to TV Shows
        <img src={plexIcon} width="25" alt="plex icon" />
      </button>
      <button
        onClick={() => {
          moveMovie();
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
            handleStartStop();
          }}
        >
          {playPauseText}
        </button>
      )}

      {disabled ? null : (
        <button
          onClick={() => {
            removeFromList(state.selectedTorrent);
          }}
          className="danger"
        >
          Remove
        </button>
      )}
    </div>
  );
}
