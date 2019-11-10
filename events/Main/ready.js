const BotEvent = require('../../handlers/event.js');
// const logger = require('../../handlers/logger');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }
  execute() {
    const gameStatus = [
      'actions. | w!help',
      `${this.guilds.size} guilds! | w!help`,
      'your server:tm:| w!help',
      'netflix. | w!help'
    ];
    // logger.log('info', `Client Info: User: ${this.user.tag} Guilds: ${this.guilds.size} Channels: ${this.channels.size} Users: ${this.users.size}`);
    console.log(`Client Info: User: ${this.user.tag} Guilds: ${this.guilds.size} Channels: ${this.channels.size} Users: ${this.users.size}`)

    this.user.setActivity(gameStatus[Math.round(Math.random() * (gameStatus.length - 1))], {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
  }
};