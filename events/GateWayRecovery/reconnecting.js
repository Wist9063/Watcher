const BotEvent = require('../../handlers/event.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'reconnecting'
    });
  }

  execute() {
    console.log('[Discord] Gateway connection lost, restarting bot.');
    process.exit(1);
  }
};