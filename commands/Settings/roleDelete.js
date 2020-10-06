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
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (b.wb.wbID === null || b.wb.wbKey === null) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {

      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
      if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
      const value = message.content.split(' ')[1];
      if (!value) return message.reply('you did not specify a value, please include on or off.');
      if (value.toUpperCase() === 'ON' || value.toUpperCase() === 'enable' || value.toUpperCase() === 'enable') return await db.update(message.guild.id, this.client.mongod, 'events', {'events.roleDelete': true}) && message.channel.send(`${message.author} | Logs will __now__ include \`roleDelete\`, database updated.`);
      if (value.toUpperCase() === 'OFF' || value.toUpperCase() === 'disable') return await db.update(message.guild.id, this.client.mongod, 'events', {'events.roleDelete': false}) && message.channel.send(`${message.author} | Logs will __not__ include \`roleDelete\`, database updated.`);
      else return message.channel.send(`${message.author} | That is not a valid value, please try again.`);
    }
  }
};