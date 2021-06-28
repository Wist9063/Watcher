const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore-list',
      disabled: true,
      aliases: ['ignorelist', 'ignored', 'ig']
    });
  }
  async execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (!b.wb.wbID) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {
      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
      let channelList = '';
      message.guild.channels.cache.forEach(c => {
        if (b.ignoreChannel.includes(c.id)) channelList += `**#${c.name}** \`(ID:${c.id})\`` + '\n';
      });
      if (channelList === '') {
        return message.channel.send('There are currently no channels ignored. To ignore a channel run the ignore command (`w!ignore <channel-mention>`), and to remove it, run the ignore-delete command (`w!ignore-delete <#channel-mention>`).');
      } else {
        const embed = new Discord.MessageEmbed().setDescription(channelList).setFooter(`Listing all ignored channels, requested by ${message.author.tag}.`, message.author.displayAvatarURL());
        return message.channel.send({ embeds: [embed] });
      }
    }
  }
};