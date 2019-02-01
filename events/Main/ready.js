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
    this.user.game_cycle = () => {
      const games = [
        'dat boi | @Jennifer help',
        `${this.guilds.size} guilds! | @Jennifer help`,
        'wist\'s problems pass by! | @Jennifer help',
        'errors | @Jennifer help',
        'the poppin\' errors | @Jennifer help',
        `${this.users.size} users! | @Jennifer help`,
        'my website | @Jennifer help',
        'wumpus | @Jennifer help',
        'you | @Jennifer help',
        'fortnite streams | @Jennifer help',
        'my code | @Jennifer help',
        'my spotify playlist | @Jennifer help'
      ];
      this.user.setActivity(games[Math.round(Math.random() * (games.length - 1))], {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
      return setTimeout(() => {
        this.user.game_cycle();
      }, 300000);
    };
  }
};
