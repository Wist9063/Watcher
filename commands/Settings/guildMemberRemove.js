const db = require('quick.db');
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildmemberremove',
      aliases: ['gmemberremove']
    });
  }

  execute(message) {
    if (!db.has(`guild_${message.guild.id}.logChannel`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {

      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
      if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
      const value = message.content.split(' ')[1];
      if (!value) return message.reply('you did not specify a value, please include on or off.').then(msg => msg.delete({timeout:10000}));
      if (value.toUpperCase() === 'ON' || value.toUpperCase() === 'enable' || value.toUpperCase() === 'enable') return db.set(`guild_${message.guild.id}.events.guildMemberRemove`, true) && message.channel.send(`${message.author} | Logs will __now__ include \`guildMemberRemove\`, database updated.`).then(msg => msg.delete({timeout:10000}));
      if (value.toUpperCase() === 'OFF' || value.toUpperCase() === 'disable') return db.set(`guild_${message.guild.id}.events.guildMemberRemove`, false) && message.channel.send(`${message.author} | Logs will __not__ include \`guildMemberRemove\`, database updated.`).then(msg => msg.delete({timeout:10000}));
      else return message.channel.send(`${message.author} | That is not a valid value, please try again.`);
    }
  }
};