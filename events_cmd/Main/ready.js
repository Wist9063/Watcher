const BotEvent = require('../../handlers/event.js');
const figlet = require('figlet');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ready'
    });
  }

  
  execute() {
    console.log('<---------------->');
    console.log('Connection to discord initialized. Watcher Command Handler is now initializing! Please wait..');
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
        ['COMPETING', 'valorant | w!help'],
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
    if (process.env.NODE_ENV == 'production') {
      console.log('Statistics ARE syncing to datadog servers.');
    } else console.log('Statistics are NOT syncing to datadog servers.');

    gameCycle(this);
    console.log('<---------------->');
  }
};