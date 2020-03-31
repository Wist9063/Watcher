const Command = require('../../handlers/command.js');
const config = require('../../config.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'purge',
      aliases: ['delete', 'clear', 'prune', 'del']
    });
  }

  async execute(message) {
    if (!db.has(`guild_${message.guild.id}.logChannel`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {
      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
      if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`${message.author} | I'm not capable of deleting messages, please ensure that I have the proper permissions to do so.`).then(m => m.delete({timeout:15000}));
      const args = message.content.slice(config.prefix.length).trim().split(' ');
      if (!args) return message.channel.send(`${message.author} | Please specify an amount of messages to purge.`).then(m => m.delete({timeout:5000}));
      if (isNaN(args[1])) return message.channel.send(`${message.author} | The value you've provided is not a valid number, please try again.`).then(m => m.delete({timeout:10000}));
      if (args[1] > 100) return message.channel.send(`${message.author} | The value you've provided exceeds Discord's message limit (100), please try again.`).then(m => m.delete({timeout:10000}));
      await message.delete();
      await message.channel.bulkDelete(args[1]).then(() => { 
        message.channel.send(`${message.author} | A total of ${args[1]} messages has been deleted.\n*This message will delete in 15 seconds.*`).then(msg => msg.delete({timeout:15000}));
        const fetched = db.get(`guild_${message.guild.id}.logChannel.id`);
        const embed = new MessageEmbed()
          .setColor('#D92C2C')
          .setAuthor(`${message.author.tag} has bulk deleted messages.`, message.author.displayAvatarURL())
          .setTitle('Bulk Delete')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`**${args[1]}** messages has been deleted.\nIn channel: ${message.channel}`)
          .setFooter(`Author ID: ${message.author.id}`)
          .setTimestamp();
        const logChannel = message.guild.channels.cache.get(fetched);
        return logChannel.send(embed);
      });
    }
  }

};