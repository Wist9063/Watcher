const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore-list',
      aliases: ['ignorelist', 'ignored', 'ig']
    });
  }
  execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
    let channelList = '';
    message.guild.channels.forEach(c => {
      const fetched = db.get(`ignoreChannel_${c.guild.id}_${c.id}.channelid`);
      if (fetched) {
        channelList += `**#${c.name}** \`(ID:${c.id})\`` + '\n';
      }
    });
    if (channelList === '') {
      return message.channel.send('There are currently no channels ignored. To ignore a channel run the ignore command (`w!ignore <channel-mention>`), and to remove it, run the ignore-delete command (`w!ignore-delete <#channel-mention>`).');
    } else {
      const embed = new Discord.MessageEmbed().setDescription(channelList).setFooter(`Listing all ignored channels, requested by ${message.author.tag}.`, message.author.displayAvatarURL());
      return message.channel.send(embed);
    }
  }
};