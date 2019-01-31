const Command = require('../../handlers/command.js');
const config = require('../../config.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'purge',
      aliases: ['delete', 'clear', 'prune', 'del']
    });
  }

  async execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`${message.author} | I'm not capable of deleting messages, please ensure that I have the proper permissions to do so.`).then(m => m.delete({timeout:15000}));
    const args = message.content.slice(config.prefix.length).trim().split(' ');
    if (!args) return message.channel.send(`${message.author} | Please specify an amount of messages to purge.`).then(m => m.delete({timeout:5000}));
    if (isNaN(args[1])) return message.channel.send(`${message.author} | The value you've provided is not a valid number, please try again.`).then(m => m.delete({timeout:10000}));
    if (args[1] > 100) return message.channel.send(`${message.author} | The value you've provided exceeds Discord's message limit (100), please try again.`).then(m => m.delete({timeout:10000}));
    await message.delete();
    await message.channel.bulkDelete(args[1]);
  }

};