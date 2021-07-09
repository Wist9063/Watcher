const BotEvent = require('../../handlers/event.js');
const moment = require('moment-timezone');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug'
    });
  }

  async execute(info) {
    if (process.env.NODE_ENV == 'production') {
      return;
    } else console.log(`[DEBUG!] [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - ${info}`);
  }
};