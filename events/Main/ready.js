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
    this.setActivity('your server. | w!help', {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
    setTimeout(() => {
      const games = [
        'your server. | w!help',
        `${this.guilds.size} guilds! | w!help`,
        'wist\'s logs. | w!help',
        'stuff. | w!help',
        'netflix. | w!help',
        `${this.users.size} users! | w!help`,
        'my server. | w!help',
        'discord. | w!help',
        'twitch. | w!help',
        'my mail. | w!help',
        'my code. | w!help',
        'youtube. | w!help'
      ];
      this.setActivity(games[Math.round(Math.random() * (games.length - 1))], {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
    }, 300000);
  }
};
