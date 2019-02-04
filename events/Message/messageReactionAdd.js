const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageReactionAdd'
    });
  }

  async execute(messageReaction, user) {
    const message = messageReaction.message;
    const fetched = await db.get(`log-channel_${message.guild.id}.channelid`);
    const fetch = await db.get(`messageReactionAdd_${message.guild.id}.value`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = message.guild.channels.get(fetched);
      if (!logChannel) return;
      const embed = new MessageEmbed()
        .setColor('#7289DA')
        .setTitle('Reaction Added')
        .setURL('https://discord.gg/EH7jKFH')
        .setDescription(`**${user.tag} added reaction to a message.**\n*User ID: ${user.id}*\n\`\`\`autohotkey\nEmoji Name: ${messageReaction.emoji.name}\n(ID: ${messageReaction.emoji.id})\nEmoji Animated? ${messageReaction.emoji.animated ? 'Yes' : 'No'}\n---\nCategory Name: ${message.channel.parent ? message.channel.parent.name : 'None'}\nChannel: #${message.channel.name}\n(ID: ${message.channel.id})\n\`\`\``)
        .setFooter(`Message ID: ${message.id}`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};