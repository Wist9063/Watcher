const { createLogger, format, transports } = require('winston');
const moment = require('moment-timezone');

const { combine, timestamp, printf } = format;


module.exports = createLogger({
  format: combine(
    format.colorize(),
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `[${moment(timestamp).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] | ${level} - ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'warn.log', level: 'warn' }),
    new transports.File({ filename: 'general.log', level: 'info' }),
    new transports.File({ filename: 'combined.log' })
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: 'exceptions.log' })
  ],
});