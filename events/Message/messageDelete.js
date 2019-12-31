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
        .setAuthor(`${message.author.tag}'s message has been deleted.`, message.author.displayAvatarURL())
        .setTitle('Message Deleted')
        .setURL('https://discord.gg/83SAWkh')
        .setDescription(`In channel: ${message.channel}\n\`\`\`md\nMessage Below\n====\n\n< ${contentValue} >\`\`\``)
        .setFooter(`Author ID: ${message.author.id} • Message ID: ${message.id}`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};