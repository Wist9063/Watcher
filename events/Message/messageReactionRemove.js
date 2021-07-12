const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageReactionRemove'
    });
  }

  async execute(messageReaction, user) {
    if (user.bot) return;
    const message = messageReaction.message;
    const b = await db.get(message.guild.id, this.mongod, 'guildSettings');
    const a = await db.get(message.guild.id, this.mongod, 'events');
    //if (!(b.ignoreChannel)) return;
    // if (b.ignoreChannel.includes(message.channel.id) === true) return;
    if (a.events.messageReactionAdd === false) return;

    if (a.events.messageReactionAdd === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey, {restGlobalRateLimit: 30});
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#DD5449')
        .setAuthor(`${user.tag} has removed a reaction to a message.`, user.displayAvatarURL())
        .setDescription(`Jump To Message: [Click Here](${messageReaction.message.url})\n\`\`\`autohotkey\nEmoji Name: ${messageReaction.emoji.name}\n(ID: ${messageReaction.emoji.id})\nEmoji Animated? ${messageReaction.emoji.animated ? 'Yes' : 'No'}\n---\nCategory Name: ${message.channel.parent ? message.channel.parent.name : 'None'}\nChannel: #${message.channel.name}\n(ID: ${message.channel.id})\n\`\`\``)
        .setFooter(`Watcher Event • Reaction Removed | Message ID: ${message.id} • Author ID: ${user.id}`)
        .setTimestamp();
      return await logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  }
};