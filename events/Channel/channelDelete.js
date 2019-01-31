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
    const fetched = await db.get(`log-channel_${channel.guild.id}.channelid`);
    const fetch = await db.get(`channelDelete_${channel.guild.id}.value`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = channel.guild.channels.get(fetched);
      if (!logChannel) return;
      const embed = new MessageEmbed()
        .setColor('#D92C2C').setTitle('Channel Deleted').setURL('https://discord.gg/EH7jKFH').setDescription(`**A channel has been deleted: #${channel.name}**.`).setFooter(`ID: ${channel.id}`).setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};