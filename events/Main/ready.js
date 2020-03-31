/* eslint-disable no-useless-escape */
const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const figlet = require('figlet');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }
  
  
  execute() {
    console.log('<---------------->');
    console.log('Connection to discord initialized.');
    // console.log(`Client Info: User: ${this.user.tag} Guilds: ${this.guilds.size} Channels: ${this.channels.size} Users: ${this.users.size}`);
    console.log('<---------------->');
    console.log(figlet.textSync('Watcher', {
      font: 'Slant Relief',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));

    const gameCycle = function(a) {
      const gameStatus = [
        'actions! | w!help',
        `${a.guilds.cache.size} guilds! | w!help`,
        'guilds. | w!help',
        'your chat. | w!help',
        'events n stuff. | w!help'
      ];
      a.user.setActivity(gameStatus[Math.floor(Math.random()*gameStatus.length)], {'url': 'https://www.twitch.tv/monstercat', 'type': 'WATCHING' });
      console.log('[Status] Game status changed.');

      setTimeout(() => {
        gameCycle(a);
      }, 300000);
    };

    console.log('\nWelcome to Watcher. Info will be printed below. *made with love and keystrokes*');
    console.log('<---------------->');
    console.log(`Guild Size: ${this.guilds.cache.size}\nUser Size: ${this.users.cache.size}\nChannels: ${this.channels.cache.size}\nDatabase Entries: ${db.all().length}\nLogged on as ${this.user.tag}`);
    console.log('<---------------->');
    
    gameCycle(this);
  }
};