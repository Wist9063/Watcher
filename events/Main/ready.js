const BotEvent = require('../../handlers/event.js');
const log = require('umi-log');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }

  execute() {
    console.log(log.info(`[Discord] Client Info: \nUser: ${this.client.user.tag}\nGuilds: ${this.client.guilds.size}\nChannels: ${this.client.channels.size}\nUsers: ${this.client.users.size}`));
    this.client.game_cycle = () => {
      const games = [
        'your server. | w!help',
        `${this.client.guilds.size} guilds! | w!help`,
        'wist\'s logs. | w!help',
        'stuff. | w!help',
        'netflix. | w!help',
        `${this.client.users.size} users! | w!help`,
        'my server. | w!help',
        'discord. | w!help',
        'twitch. | w!help',
        'my mail. | w!help',
        'my code. | w!help',
        'youtube. | w!help'
      ];
      this.client.user.setActivity(games[Math.round(Math.random() * (games.length - 1))], {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
      return setTimeout(() => {
        this.client.game_cycle();
      }, 300000);
    };
  }
};
