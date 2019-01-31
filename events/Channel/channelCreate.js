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
      const embed = new MessageEmbed()
        .setColor('#7289DA').setTitle('Channel Created').setURL('https://discord.gg/EH7jKFH').setDescription(`**A channel has been created: ${channel}**.`).setFooter(`ID: ${channel.id}`).setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};