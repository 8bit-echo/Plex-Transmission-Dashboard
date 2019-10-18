import React, { useEffect } from 'react';
import './styles/transmission.scss';
import Torrent from './Torrent';
import { useGlobalState } from '../State';
import { get } from '../functions';

export default function Transmission() {
  const [state, dispatch] = useGlobalState();
  const { torrents } = state;

  useEffect(() => {
    get('/torrents').then(response => {
      dispatch({ type: 'GOT_TORRENTS', payload: response.torrents });
    });
  }, [dispatch]);

  let mappedTorrents = '';

  if (torrents && !!torrents.length) {
    mappedTorrents = torrents.map((t: any) => <Torrent data={t} key={t.id} />);
  }

  return (
    <div
      className="transmission"
      onClick={e => {
        console.log('tx click');
        e.stopPropagation();
        dispatch({ type: 'DESELECT_TORRENT' });
      }}
    >
      {mappedTorrents}
    </div>
  );
}
