const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'channelDelete'
    });
  }

  async execute(channel) {
    const fetched = await db.get(`guild_${channel.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${channel.guild.id}.events.channelDelete`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = channel.guild.channels.get(fetched);
      if (!logChannel) return;

      if (channel.type === 'text') {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Text Channel Deleted')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`**A text channel has been deleted: ${channel}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (channel.type === 'voice') {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Voice Channel Deleted')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`**A voice channel has been deleted: ${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (channel.type === 'category') {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Category Deleted')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`**A Category has been deleted: ${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Unknown Channel Deleted')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`**An unknown channel type has been deleted: ${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      }
    } else {
      return;
    }
  }
};