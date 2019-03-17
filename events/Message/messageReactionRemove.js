const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageReactionRemove'
    });
  }

  async execute(messageReaction, user) {
    const message = messageReaction.message;
    const fetched = await db.get(`guild_${message.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${message.guild.id}.events.messageReactionRemove`);
    const ignoreFetch = await db.get(`guild_${message.guild.id}.ignoreChannel.${message.channel.id}`);
    if (ignoreFetch) {
      if (message.channel.id === ignoreFetch) return;
    } else if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = message.guild.channels.get(fetched);
      if (!logChannel) return;
      const embed = new MessageEmbed()
        .setColor('#D92C2C')
        .setTitle('Reaction Removed')
        .setURL('https://discord.gg/EH7jKFH')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`Jump To Message: [Click Here](${messageReaction.message.url})\n\`\`\`autohotkey\nEmoji Name: ${messageReaction.emoji.name}\n(ID: ${messageReaction.emoji.id})\nEmoji Animated? ${messageReaction.emoji.animated ? 'Yes' : 'No'}\n---\nCategory Name:\n${message.channel.parent ? message.channel.parent.name : 'None'}\nChannel: #${message.channel.name}\n(ID: ${message.channel.id})\n\`\`\``)
        .setFooter(`Message ID: ${message.id} • Author ID: ${user.id}`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};