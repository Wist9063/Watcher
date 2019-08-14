const BotEvent = require('../../handlers/event.js');
const logger = require('../../handlers/logger');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }
  execute() {
    logger.log('info', `Client Info: User: ${this.user.tag} Guilds: ${this.guilds.size} Channels: ${this.channels.size} Users: ${this.users.size}`);
    this.user.setActivity('servers! | w!help', {type:'WATCHING'});
  }
};