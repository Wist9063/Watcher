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
    const fetched = await db.get(`guild_${message.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${message.guild.id}.events.channelDelete`);
    const ignoreFetch = await db.get(`guild_${message.guild.id}.ignoreChannel.${message.channel.id}`);
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
        .setColor('#D92C2C')
        .setTitle('Message Deleted')
        .setURL('https://discord.gg/EH7jKFH')
        .setDescription(`${message.author.tag} (ID:${message.author.id}) has deleted their message sent in ${message.channel}.\n\n\`\`\`${contentValue}\`\`\``)
        .setFooter(`ID: ${message.id}`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};