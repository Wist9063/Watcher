const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageDelete'
    });
  }

  async execute(message) {
    if (message.author.bot) return;
    const fetched = await db.get(`log-channel_${message.guild.id}.channelid`);
    const fetch = await db.get(`messageDelete_${message.guild.id}.value`);
    const ignoreFetch = await db.get(`ignoreChannel_${message.guild.id}_${message.channel.id}.channelid`);
    if (ignoreFetch) {
      if (message.channel.id === ignoreFetch) return;
    } else if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = message.guild.channels.get(fetched);
      if (!logChannel) return;
      let contentValue = message.content;
      if (contentValue.length > 500) contentValue = contentValue.substring(0, 499) + '...';
      const embed = new MessageEmbed()
        .setColor('#D92C2C').setTitle('Message Deleted').setURL('https://discord.gg/EH7jKFH').setDescription(`${message.author.tag} (ID:${message.author.id}) has deleted their message sent in ${message.channel}.\n\n\`\`\`${contentValue}\`\`\``).setFooter(`ID: ${message.id}`).setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};