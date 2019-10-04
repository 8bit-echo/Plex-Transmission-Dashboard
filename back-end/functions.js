const NodeSSH = require('node-ssh');
const ssh = new NodeSSH();
const serverRoot = '/media/mini/ServerSpace/';
const downloads = `${serverRoot}Downloads`;
const movies = `${serverRoot}/Media/Movies/`;
const tvShows = `${serverRoot}/Media/TV Shows/`;
const sshConfig = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER1,
  privateKey: process.env.SSH_KEY_PATH
};
const sshConfigRoot = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER2,
  privateKey: process.env.SSH_KEY_PATH
};

async function shell(cmd) {
  try {
    const connection = await ssh.connect(sshConfig);
    const result = await connection.exec(cmd);
    connection.dispose();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function sudo(cmd) {
  try {
    const connection = await ssh.connect(sshConfigRoot);
    const result = await connection.exec(cmd);
    // connection.dispose();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function getVPNStatus() {
  try {
    let output = await shell('pgrep vpn');
    return output;
  } catch (error) {
    console.log(error);
  }
}

async function disableVPN() {
  try {
    let output = await sudo('kill $(pgrep vpn)');
    console.log(`output of sudo cmd: ${typeof output}`);
    console.log(output);
    if (output.length >= 1) {
      return { error: null };
    }
  } catch (error) {
    console.error('disable VPN Error');
    return 'disable VPN Error';
  }
}

async function enableVPN() {
  try {
    let output = await sudo(
      'openvpn --config /home/mini/Templates/minivultr.ovpn --mute-replay-warnings'
    );
    // if (output.length >= 1) {
    //   return { error: null };
    // }
    console.log(output);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

async function getTVFolders() {
  try {
    const folders = await shell(`ls "${serverRoot}/Media/TV Shows"`);
    const asArray = JSON.parse(`["${folders.replace(/\n/g, `","`)}"]`);
    return asArray;
  } catch (error) {
    console.log(error);
  }
}

function guessTVShow(file, folders) {
  let bestGuess = undefined;
  folders.some((folder, i) => {
    const fileName = stringPrep(file);
    const folderName = stringPrep(folder);
    if (fileName.includes(folderName)) {
      bestGuess = folders[i];
    }
    return fileName.includes(folderName);
  });

  return bestGuess;
}

function stringPrep(str) {
  return str
    .toLowerCase()
    .replace(
      /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(aac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray))/gi,
      ''
    )
    .replace(
      /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt))/gi,
      ''
    )
    .replace(/(\(\))|(\[\])/gi, '');
}

function extractSeasonNumber(fileName, withPrefix = false) {
  const match = fileName.match(/s(\d\d?)/i);
  if (match) {
    // remove leading 0 in season nums < 10
    match[1] =
      match[1].toString().charAt(0) === '0' ? match[1].slice(1, 2) : match[1];
    return `${withPrefix ? 'Season ' : ''}${match[1]}`;
  }
  return `. Couldn't determine `;
}

async function isDir(fileName) {
  try {
    const cd = await shell(`cd "${downloads}/${fileName}"`);
    if (cd == '') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

async function folderExists(path) {
  console.log(`checking for existing directory at: ${path}`);
  const exists = await shell(`[ -d "${path}" ] && echo "true" || echo "false"`);
  return JSON.parse(exists);
}

async function moveToMovies(fileName) {
  console.log(`executing move file ${fileName}`);
  const mv = await shell(`mv "${downloads}/${fileName}" "${movies}"`);
  const result = await mv;
  console.log(result);
  if (result == '') {
    return true;
  } else {
    return false;
  }
}

async function moveToTVShows(fileName, seasonPath) {
  console.log(`executing move file ${fileName}`);

  const exists = await folderExists(seasonPath);

  if (!exists) {
    await makeDir(seasonPath);
  }

  const mv = await shell(`mv "${downloads}/${fileName}" "${seasonPath}/"`);
  const result = await mv;
  if (result == '') {
    return true;
  } else {
    return false;
  }
}

async function removeDirtyFiles(dir) {
  console.log('cleaning up file structure');
  try {
    await shell(
      `find "${downloads}/${dir}" \\( -iname \\*.jpg -o -iname \\*.nfo -o -iname \\*.png -o -iname \\*.txt  \\) -type f -delete`
    );
    return true;
  } catch (error) {
    console.log(`dirty file cleanup caught error: ${error}`);
    return false;
  }
}

async function makeDir(dir) {
  console.log(`path does not exist. making directory now at ${path}`);
  const mkdir = await shell(`mkdir ${dir}`);
  return true;
}

module.exports = {
  serverRoot,
  downloads,
  tvShows,
  movies,
  shell,
  getVPNStatus,
  disableVPN,
  enableVPN,
  getTVFolders,
  guessTVShow,
  extractSeasonNumber,
  isDir,
  folderExists,
  moveToMovies,
  removeDirtyFiles,
  moveToTVShows,
  makeDir
};

// folderExists(`${tvShows}/Ink Master/Season 12`);