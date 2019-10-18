import React from 'react';
import './styles/torrent.scss';
import classNames from 'classnames';
import { useGlobalState } from '../State';

export default function Torrent(data: any) {
  const [state, dispatch] = useGlobalState();
  const torrent = data.data;
  const torrentClasses = classNames('torrent', {
    selected: (state.selectedTorrent && state.selectedTorrent.id === torrent.id)
  });

  const progressBarClasses = classNames('progress-bar', {
    done: torrent.percentDone === 1
  });

  const downloadRate = !!torrent.rateDownload ? (
    <span className="download-rate">↓ {toHuman(torrent.rateDownload)}/s</span>
  ) : null;

  return (
    <div
      className={torrentClasses}
      onClick={e => {
        e.stopPropagation();
        console.log('torrent click');
        dispatch({ type: 'SELECT_TORRENT', payload: torrent });
      }}
    >
      <div className="inner-container">
        <p className="name"> {cleanup(torrent.name)} </p>
        <div className="meta">
          {toPercentage(torrent.percentDone)} of {toHuman(torrent.sizeWhenDone)}
          {downloadRate}
        </div>
      </div>
      <div
        className={progressBarClasses}
        style={{ width: toPercentage(torrent.percentDone) }}
      ></div>
    </div>
  );
}

const toHuman = (bytes: number): string => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    ((bytes / Math.pow(1024, i)) * 1).toFixed(2) +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  );
};

const toPercentage = (float: number) => {
  return (float * 100).toFixed(2) + '%';
};

const cleanup = (string: string) => {
  return string
    .replace(
      /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(a?ac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray)|(dvd(rip)?))/gi,
      ''
    )
    .replace(
      /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt)|(yts\.am)|(rarbg))/gi,
      ''
    )
    .replace(/(mkv)|(avi)|(mp4)/gi, '')
    .replace(/(\(\))|(\[\])/gi, '')
    .replace(/\./g, ' ');
};
