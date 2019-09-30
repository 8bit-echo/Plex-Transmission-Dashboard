const NodeSSH = require('node-ssh');
const ssh = new NodeSSH();
const serverRoot = '/media/mini/ServerSpace/';
const sshConfig = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER1,
  privateKey: process.env.SSH_KEY_PATH,
};
const sshConfigRoot = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER2,
  privateKey: process.env.SSH_KEY_PATH,
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
    let output = await sudo('openvpn --config /home/mini/Templates/minivultr.ovpn --mute-replay-warnings');
    // if (output.length >= 1) {
    //   return { error: null };
    // }
      console.log(output);
      return { error: null };
  } catch (error) {
    return { error };
  }
}

module.exports = {
  shell,
  getVPNStatus,
  disableVPN,
  enableVPN,
};
