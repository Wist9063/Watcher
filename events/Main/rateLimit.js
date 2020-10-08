const BotEvent = require('../../handlers/event.js');
const moment = require('moment-timezone');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'rateLimit'
    });
  }

  async execute(rateLimitInfo) {
    console.log(`[API RATELIMIT!] [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - Ratelimit has been emited, timed out for ${rateLimitInfo.timeout}. Method: ${rateLimitInfo.path}`);
  }
};