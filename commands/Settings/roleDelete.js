const db = new (require('../../handlers/database.js'))();
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'roleDelete',
      aliases: ['rDelete']
    });
  }

  async execute(message) {
    if (message.perm < 2) return message.reply({ content: 'Insufficient permissions required to execute this command.', allowedMentions: { repliedUser: true }});
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    const a = await db.get(message.guild.id, this.client.mongod, 'events');
    if (b.wb.wbID === null || b.wb.wbKey === null) {
      message.reply({ content: 'You didn\'t setup a log channel yet! Run w!setup to setup one.', allowedMentions: { repliedUser: true }});
    } else {
      // if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
      const value = message.content.split(' ')[1];
      if (!value) return message.reply('You did not specify a value, please include on or off.');
      if (value.toUpperCase() === 'ON' || value.toUpperCase() === 'ENABLE') {
        if (a.events.roleDelete === true) {
          return message.reply({ content: 'The event `roleDelete` is already enabled.', allowedMentions: { repliedUser: false }});
        } else {
          return await db.update(message.guild.id, this.client.mongod, 'events', {'events.roleDelete': true}) && message.reply({ content: 'Logs will __now__ include `roleDelete`, database updated.', allowedMentions: { repliedUser: true }});
        }
      }
      if (value.toUpperCase() === 'OFF' || value.toUpperCase() === 'DISABLE') {
        if (a.events.roleDelete === false) {
          return message.reply({ content: 'The event `roleDelete` is already disabled.', allowedMentions: { repliedUser: false }});
        } else {
          return await db.update(message.guild.id, this.client.mongod, 'events', {'events.roleDelete': false}) && message.reply({ content: 'Logs will __not__ include `roleDelete`, database updated.', allowedMentions: { repliedUser: true }});
        }
      }
      else return message.reply({ content: 'That is not a valid value, please try again.', allowedMentions: { repliedUser: true }});
    }
  }
};