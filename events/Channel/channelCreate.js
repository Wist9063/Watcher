const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'channelCreate'
    });
  }

  async execute(channel) {
    if (channel.type === 'dm') return;
    const fetched = await db.get(`log-channel_${channel.guild.id}.channelid`);
    const fetch = await db.get(`channelCreate_${channel.guild.id}.value`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = channel.guild.channels.get(fetched);
      if (!logChannel) return;

      if (channel.type === 'text') {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Text Channel Created')
          .setURL('https://discord.gg/EH7jKFH')
          .setDescription(`**A text channel has been created: ${channel}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (channel.type === 'voice') {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Voice Channel Created')
          .setURL('https://discord.gg/EH7jKFH')
          .setDescription(`**A voice channel has been created: ${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (channel.type === 'category') {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Category Created')
          .setURL('https://discord.gg/EH7jKFH')
          .setDescription(`**A Category has been created: ${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else {
        const embed = new MessageEmbed()
          .setColor('#7289DA').setTitle('Unknown Channel Created')
          .setURL('https://discord.gg/EH7jKFH')
          .setDescription(`**An unknown channel type has been created: ${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      }
    } else {
      return;
    }
  }
};