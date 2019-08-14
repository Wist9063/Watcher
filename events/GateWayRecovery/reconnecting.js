const BotEvent = require('../../handlers/event.js');
const logger = require('../../handlers/logger');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'reconnecting'
    });
  }

  execute() {
    logger.info('[Discord] Gateway connection lost, restarting bot.');
    process.exit(1);
  }
};