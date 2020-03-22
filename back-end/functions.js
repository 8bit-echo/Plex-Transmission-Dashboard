const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const serverRoot = process.env.SERVER_ROOT;
const downloads = `${serverRoot}/${process.env.DOWNLOADS_DIR}`;
const movies = `${serverRoot}/${process.env.MOVIES_LIB_DIR}`;
const tvShows = `${serverRoot}/${process.env.TV_SHOWS_LIB_DIR}`;

async function shell(cmd) {
  console.log(`$ ${cmd}`);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      console.log(`> ${stdout}`);
      resolve(stdout);
    });
  });
}

async function getVPNStatus() {
  try {
    let output = await shell(
      `pgrep -x openvpn >/dev/null && echo "true" || echo "false"`
    );
    return { status: JSON.parse(output) };
  } catch (error) {
    console.log(error);
  }
}

async function disableVPN() {
  console.log('disabling vpn');
  const psTree = require('ps-tree');

  const kill = pid => {
    const killTree = true;
    if (killTree) {
      psTree(pid, (err, children) => {
        [pid]
          .concat(
            children.map(p => {
              return p.PID;
            })
          )
          .forEach(tpid => {
            try {
              process.kill(tpid, 'SIGKILL');
            } catch (ex) {}
          });

        return true;
      });
    } else {
      try {
        process.kill(pid, 'SIGKILL');
      } catch (ex) {}
    }
  };

  const pid = await shell('pgrep openvpn');
  return kill(pid);
}

async function enableVPN() {
  console.log('enabling vpn');
  const sh = require('child_process').exec;
  ovpnProcess = sh('openvpn /home/mini/Templates/minivultr.ovpn');
  ovpnProcess.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  ovpnProcess.stderr.on('data', function(data) {
    console.log('stdout: ' + data);
  });
  ovpnProcess.on('close', function(code) {
    console.log('closing code: ' + code);
  });

  return setTimeout(() => {
    return true;
  }, 2000);
}

async function getTVFolders() {
  try {
    const folders = await shell(`ls "${tvShows}"`);
    const asArray = JSON.parse(`["${folders.replace(/\n/g, `","`)}"]`);
    return asArray;
  } catch (error) {
    console.log(error);
  }
}

function guessTVShow(file, folders) {
  const Fuzzyset = require('fuzzyset.js');
  // remove empty strings as they can cause unexpected results.
  folders.filter(folder => folder !== '');

  const stringCompare = new Fuzzyset(folders, false);
  const match = stringCompare.get(file);

  if (match && match[0][1]) {
    console.log('match: ', match[0][1]);
    return folders[folders.indexOf(match[0][1])];
  }
  return false;
}

function stringPrep(str) {
  return str
    .toLowerCase()
    .replace(
      /(web?(rip|dl)|\[[a-z]+\]|((h|x)\.?26(4|5))|(hdtv)|(\d{3,4}p)|(-)|(aac(\d\.\d)?)|(www\.(.+)\.(com|org|net))|(HEVCs?|10.?bit)|(bluray))|(xvid)/gi,
      ''
    )
    .replace(
      /((megusta)|(deflate)|(crimson)|(avs)|(btw)|(spik)|(internal)|(web)|(trump)|(yts\.lt))/gi,
      ''
    )
    .replace(/(\(\))|(\[\])/gi, '')
    .replace(/\./g, ' ');
}

function extractSeasonNumber(fileName, withPrefix = false) {
  const match = fileName.match(/s(\d\d?)/i);
  const fullSeason = fileName.match(/season ?(\d\d?)/i);
  if (match) {
    // remove leading 0 in season nums < 10
    match[1] =
      match[1].toString().charAt(0) === '0' ? match[1].slice(1, 2) : match[1];
    return `${withPrefix ? 'Season ' : ''}${match[1]}`;
  } else if (fullSeason) {
    return `${withPrefix ? 'Season ' : ''}${fullSeason[1]}`;
  }
  return `. Couldn't determine `;
}

async function isDir(fileName) {
  try {
    const dir = await shell(`isDir "${downloads}/${fileName}"`);
    return JSON.parse(dir);
  } catch (error) {
    return false;
  }
}

async function folderExists(path) {
  const exists = await shell(`[ -d "${path}" ] && echo "true" || echo "false"`);
  return JSON.parse(exists);
}

async function moveToMovies(fileName) {
  console.log(`moving file to Movies...`);
  const mv = await shell(`mv "${downloads}/${fileName}" "${movies}/"`);
  const result = await mv;
  console.log(result);
  shell(`tree ${movies}`);
  if (result == '') {
    return true;
  } else {
    return false;
  }
}

async function moveToTVShows(fileName, seasonPath) {
  const seasonPathExists = await folderExists(seasonPath);
  if (seasonPathExists) {
    const mv = await shell(`mv "${downloads}/${fileName}" "${seasonPath}/"`);
    const result = await mv;
    if (result || !result) return true;
  } else {
    const mkdir = await makeDir(seasonPath);
    if (await folderExists(seasonPath)) {
      const mv = await shell(`mv "${downloads}/${fileName}" "${seasonPath}/"`);
      const result = await mv;
      if (result || !result) return true;
    }
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
  console.log(`path does not exist. making directory now...`);
  shell(`mkdir "${dir}"`)
    .then(() => {
      return true;
    })
    .catch(error => {
      console.log(error);
      return false;
    });
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
