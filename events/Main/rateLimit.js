const BotEvent = require('../../handlers/event.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'rateLimit'
    });
  }

  async execute(rateLimitInfo) {
    console.log(rateLimitInfo);
  }
};