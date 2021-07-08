const useFilters = () => {
  /**
   * converts number of bytes to human readable format
   */
  const toHuman = (bytes: number) => {
    if (!bytes) return 'unknown';

    const i = Math.floor(Math.log(bytes) / Math.log(1000));
    return `${(bytes / Math.pow(1000, i)).toFixed(2)} ${
      ['B', 'kB', 'MB', 'GB', 'TB'][i]
    }`;
  };

  const toPercentage = (float: number) => `${(float * 100).toFixed(2)}%`;

  /**
   * removes a bunch of the garbage strings from torrent names. far from perfect.
   **/
  const cleanup = (string: string) => {
    return string
      ?.replace(
        /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(aac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray)|(dvd(rip)?)|(DL)|(DD\+\d( \d)?))|(xvid)/gi,
        ''
      )
      .replace(
        /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt)|(yts\.am)|(rarbg)|(AMZN)|(metcon)|(red dawn)|(AMRAP)|(Slashdance)|(AJP69)|(Red\.Dawn)|(qman)|(tbs)|(freethefish))/gi,
        ''
      )
      .replace(/(mkv)|(avi)|(mp4)/gi, '')
      .replace(/(\(\))|(\[\])|(\.\d)/gi, '')
      .replace(/\./g, ' ');
  };
  const capitalize = (string: string) => {
    string = string[0].toUpperCase() + string.slice(1);
    return string.replace(/_/g, '');
  };

  return { toHuman, toPercentage, cleanup, capitalize };
};

export { useFilters };
