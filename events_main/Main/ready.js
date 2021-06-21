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
    console.log('Connection to discord initialized. Watcher Event Handler is now initializing! Please wait..');
    console.log('<---------------->');
    console.log(figlet.textSync('Watcher', {
      font: 'Slant Relief',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));


    console.log('\nWelcome to Watcher. Info will be printed below. *made with love and keystrokes*');
    console.log('<---------------->');
  }
};