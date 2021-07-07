const BotEvent = require('../../handlers/event.js');
const moment = require('moment-timezone');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug'
    });
  }

  async execute(invalidRequestWarningData) {
    console.log(`[INC RATELIMIT!] [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - Count: ${invalidRequestWarningData.count} | Remaining Time: ${invalidRequestWarningData.remainingTime}`);
  }
};