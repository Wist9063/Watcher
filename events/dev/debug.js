const BotEvent = require('../../handlers/event.js');
const log = require('../../modules/logger.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug'
    });
  }

  async execute(info) {
    if (process.env.NODE_ENV == 'production') {
      return;
    } else log('DEBUG!', info);
  }
};