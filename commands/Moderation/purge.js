const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'purge',
      aliases: ['delete', 'clear', 'prune', 'del']
    });
  }

  async execute(message) {
    db.get(message.guild.id, this.client.mongod, 'guildSettings').then((b) => {
      if (b.wb.wbID === null || b.wb.wbKey === null) {
        message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
      } else {
        if (message.perm < 2) return message.channel.send(`${message.author}, you have insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`${message.author} | I'm not capable of deleting messages, please ensure that I have the proper permissions to do so.`).then(m => m.delete({timeout:15000}));
        const args = message.content.split(' ')[1];
        if (!args) return message.channel.send(`${message.author} | Please specify an amount of messages to purge.`).then(m => m.delete({timeout:5000}));
        if (isNaN(args[1])) return message.channel.send(`${message.author} | The value you've provided is not a valid number, please try again.`).then(m => m.delete({timeout:10000}));
        if (args[1] < 1) return message.channel.send(`${message.author} | The value you've provided exceeds Discord's bulk delete message limit (100), please try again.`).then(m => m.delete({timeout:10000}));
        if (args[1] > 100) return message.channel.send(`${message.author} | The value you've provided exceeds Discord's bulk delete message limit (100), please try again.`).then(m => m.delete({timeout:10000}));
        message.channel.bulkDelete(args[1], true).then(() => { 
          message.channel.send(`${message.author} | A total of ${args[1]} messages has been deleted.`);
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          const embed = new MessageEmbed()
            .setColor('#FF8686')
            .setAuthor(`${message.author.tag} has bulk deleted messages.`, message.author.displayAvatarURL())
            .setTitle('Watcher Event - Bulk Delete')
            .setURL('https://discord.gg/83SAWkh')
            .setDescription(`**${args[1]}** messages has been deleted.\nIn channel: ${message.channel}`)
            .setFooter(`Watcher Event • Bulk Delete | User ID: ${message.author.id}`)
            .setTimestamp();
          return logChannel.send(embed);
        });
      }
    });
  }

};