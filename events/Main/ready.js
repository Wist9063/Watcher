const BotEvent = require('../../handlers/event.js');
const figlet = require('figlet');
const moment = require('moment-timezone');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }

  
  execute() {
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
        ['PLAYING', 'the waiting game | w!help'],
        ['LISTENING', `${a.guilds.cache.size} guilds! | w!help`],
        ['WATCHING', 'your chat | w!help'],
        ['WATCHING', 'netflix | w!help'],
        ['LISTENING', 'events n stuff | w!help'],
        ['LISTENING', 'myself | w!help'],
        ['COMPETING', 'valorant | w!help'],
        ['WATCHING', 'you | w!help'],
        ['LISTENING', 'w!help']
      ];
      let game; //= gameStatus[Math.floor(Math.random()*gameStatus.length)];
      if (process.env.NODE_ENV == 'production') {
        game = gameStatus[Math.floor(Math.random()*gameStatus.length)];
      } else {game = ['COMPETING', 'development mode.'];}
      a.user.setActivity(game[1], {'url': 'https://www.twitch.tv/monstercat', 'type': game[0] });
      setTimeout(() => {
        gameCycle(a);
      }, 300000);
    };
    console.log('Set game status.');

    const datadogsync = function(c) {
      c.datadog.gauge('watcher_memory_usage', (process.memoryUsage().rss / 1024 / 1024).toFixed(2));
      c.datadog.gauge('watcher_heap_usage', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));
      c.datadog.gauge('watcher_heartbeat_ping', c.ws.ping);
      c.datadog.gauge('watcher_guilds', c.guilds.cache.size);
      c.datadog.gauge('watcher_event_sender', c.eventsend);
      setTimeout(() => {
        datadogsync(c);
      }, 30000);
    };

    console.log('\nWelcome to Watcher. Info will be printed below. *made with love and keystrokes*');
    
    console.log('<---------------->');
    if (this.config.maintenance) {
      console.log('[WARNING!] Watcher has launched in maintenance mode. Use --force to run any commands in maintenance mode!');
    }
    console.log(`Guild Size: ${this.guilds.cache.size}\nUser Size: ${this.users.cache.size}\nChannels: ${this.channels.cache.size}\nUsing account: ${this.user.tag}\nLaunched at ${moment(this.readyAt).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}`);
    
    if (process.env.NODE_ENV == 'production') {
      console.log('Statistics ARE syncing to datadog servers.');
      datadogsync(this);
    } else console.log('Statistics are NOT syncing to datadog servers.');
    gameCycle(this);
    console.log('<---------------->');
  }
};