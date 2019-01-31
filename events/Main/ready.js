const BotEvent = require('../../handlers/event.js');
const log = require('umi-log');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }

  execute() {
    console.log(log.info(`[Discord] Client Info: \nUser: ${this.user.tag}\nGuilds: ${this.guilds.size}\nChannels: ${this.channels.size}\nUsers: ${this.users.size}`));
    this.user.setPresence({ activity: { name: 'w!help | V1.0.0', type: 0 } });
  }
};
