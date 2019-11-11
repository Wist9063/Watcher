const BotEvent = require('../../handlers/event.js');
// const  = require('../../handlers/');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'reconnecting'
    });
  }

  execute() {
    // .info('[Discord] Gateway connection lost, restarting bot.');
    console.log('[Discord] Gateway connection lost, restarting bot.')
    process.exit(1);
  }
};