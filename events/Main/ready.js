/* eslint-disable no-useless-escape */
const BotEvent = require('../../handlers/event.js');
const figlet = require('figlet');
const moment = require('moment-timezone');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }
  
  
  async execute() {
    console.log('<---------------->');
    console.log('Connection to discord initialized. Watcher is now initializing! Please wait..');
    console.log('<---------------->');
    console.log(figlet.textSync('Watcher', {
      font: 'Slant Relief',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));

    const gameCycle = function(a) {
      const gameStatus = [
        ['PLAYING', 'the waiting game. | w!help'],
        ['LISTENING', `${a.guilds.cache.size} guilds! | w!help`],
        ['WATCHING', `${a.users.cache.size} users! | w!help`],
        ['WATCHING', 'your chat. | w!help'],
        ['WATCHING', 'the SpaceX launch. | w!help'],
        ['WATCHING', 'some netflix. | w!help'],
        ['LISTENING', 'events n stuff. | w!help']
      ];
      const game = gameStatus[Math.floor(Math.random()*gameStatus.length)];
      a.user.setActivity(game[1], {'url': 'https://www.twitch.tv/monstercat', 'type': game[0] });
      setTimeout(() => {
        gameCycle(a);
      }, 300000);
    };

    console.log('\nWelcome to Watcher. Info will be printed below. *made with love and keystrokes*');
    console.log('<---------------->');
    if (this.config.maintenance) {
      console.log('[WARNING!] Watcher has launched in maintenance mode. Use --force to run any commands in maintenance mode!');
    }
    console.log(`Guild Size: ${this.guilds.cache.size}\nUser Size: ${this.users.cache.size}\nChannels: ${this.channels.cache.size}\nUsing account: ${this.user.tag}\nLaunched at ${moment(this.readyAt).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}`);
    
    gameCycle(this);
  }
};