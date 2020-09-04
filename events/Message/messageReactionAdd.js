const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const sentry = require('@sentry/node');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageReactionAdd'
    });
  }

  async execute(messageReaction, user) {
    const message = messageReaction.message;
    await db.get(message.guild.id, this.mongod, 'events').then((a) => {
      db.get(message.guild.id, this.mongod, 'guildSettings').then((b) => {
        if (!(b.ignoreChannel)) return;
        if (b.ignoreChannel.includes(message.channel.id) === true) return;
        if (a.events.messageReactionAdd === false) return;

        if (a.events.messageReactionAdd === true) {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;
          this.datadog.increment('watcher_event_send');

          const embed = new MessageEmbed()
            .setColor('#5cb85c')
            .setAuthor(`${user.tag} has added a reaction to a message.`, user.displayAvatarURL())
            .setDescription(`Jump To Message: [Click Here](${messageReaction.message.url})\n\`\`\`autohotkey\nEmoji Name: ${messageReaction.emoji.name}\n(ID: ${messageReaction.emoji.id})\nEmoji Animated? ${messageReaction.emoji.animated ? 'Yes' : 'No'}\n---\nCategory Name:\n${message.channel.parent ? message.channel.parent.name : 'None'}\nChannel: #${message.channel.name}\n(ID: ${message.channel.id})\n\`\`\``)
            .setFooter(`Watcher Event • Reaction Added | Message ID: ${message.id} • Author ID: ${user.id}`)
            .setTimestamp();
          return logChannel.send(embed);
        } else {
          return;
        }
      }).catch(e => {sentry.captureException(e);});
    }).catch(e => {sentry.captureException(e);});
  }
};