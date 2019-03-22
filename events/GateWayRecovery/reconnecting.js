const BotEvent = require('../../handlers/event.js');
const log = require('umi-log');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'reconnecting'
    });
  }

  execute() {
    console.log(log.info('[Discord] Gateway connection lost, restarting bot.'));
    process.exit(1);
  }
};