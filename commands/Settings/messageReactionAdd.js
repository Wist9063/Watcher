const db = new (require('../../handlers/database.js'))();
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'msgreactionadd',
      aliases: ['messagereactionadd', 'mreactionadd']
    });
  }

  async execute(message) {
    await db.get(message.guild.id, this.client.mongod, 'guildSettings').then((b) => {
      if (b.wb.wbID === null || b.wb.wbKey === null) {
        message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
      } else {

        if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
        if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
        const value = message.content.split(' ')[1];
        if (!value) return message.reply('you did not specify a value, please include on or off.');
        if (value.toUpperCase() === 'ON' || value.toUpperCase() === 'enable' || value.toUpperCase() === 'enable') return this.client.mongod.db('watcher').collection('events').findOneAndUpdate({gID: message.guild.id}, {$set: {'events.messageReactionAdd': true}}) && message.channel.send(`${message.author} | Logs will __now__ include \`messageReactionAdd\`, database updated.`);
        if (value.toUpperCase() === 'OFF' || value.toUpperCase() === 'disable') return this.client.mongod.db('watcher').collection('events').findOneAndUpdate({gID: message.guild.id}, {$set: {'events.messageReactionAdd': false}}) && message.channel.send(`${message.author} | Logs will __not__ include \`messageReactionAdd\`, database updated.`);
        else return message.channel.send(`${message.author} | That is not a valid value, please try again.`);
      }
    });
  }
};