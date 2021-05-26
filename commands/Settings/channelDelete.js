const db = new (require('../../handlers/database.js'))();
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'channeldelete',
      aliases: ['channeldel']
    });
  }

  async execute(message) {
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (b.wb.wbID === null || b.wb.wbKey === null) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {

      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
      // if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
      const value = message.content.split(' ')[1];
      if (!value) return message.reply('You did not specify a value, please include on or off.', {disableMentions: {repliedUser: false}});
      if (value.toUpperCase() === 'ON' || value.toUpperCase() === 'ENABLE') return await db.update(message.guild.id, this.client.mongod, 'events', {'events.channelDelete': true})  && message.reply('Logs will __now__ include `channelDelete`, database updated.');
      if (value.toUpperCase() === 'OFF' || value.toUpperCase() === 'DISABLE') return await db.update(message.guild.id, this.client.mongod, 'events', {'events.channelDelete': false}) && message.reply('Logs will __not__ include `channelDelete`, database updated.', {reply: false});
      else return message.channel.send(`${message.author} | That is not a valid value, please try again.`);
    }
  }
};