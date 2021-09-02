const moment = require('moment-timezone');

module.exports = (type, message) => { 
  if (!type) type = 'N/A';
  if (!message) return 'No Message Provided';

  console.log(`[${type}] - [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] | ${message}`);
};