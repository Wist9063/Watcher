const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }
  execute() {
    console.log('<---------------->');
    const gameStatus = [
      'actions. | w!help',
      `${this.guilds.size} guilds! | w!help`,
      'your server:tm:| w!help',
      'netflix. | w!help'
    ];
    console.log('Connection to discord initialized.');
    // console.log(`Client Info: User: ${this.user.tag} Guilds: ${this.guilds.size} Channels: ${this.channels.size} Users: ${this.users.size}`);
    console.log('<---------------->');
    console.log('Welcome to Watcher console log. Info will be printed below. Logged on as ' + this.user.tag + '.');
    console.log('<---------------->');
    console.log(`Guild Size: ${this.guilds.size}\nUser Size: ${this.users.size}\nChannels: ${this.channels.size}\nDatabase Entries: ${db.all().length}`);
    console.log('<---------------->');

    this.user.setActivity(gameStatus[Math.round(Math.random() * (gameStatus.length - 1))], {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
  }
};