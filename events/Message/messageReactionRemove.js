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
    const message = messageReaction.message;
    await db.get(message.guild.id, this.mongod, 'events').then((a) => {
      db.get(message.guild.id, this.mongod, 'guildSettings').then((b) => {
        if (b.ignoreChannel.includes(message.channel.id) === true) return;
        if (a.events.messageReactionAdd === false) return;

        if (a.events.messageReactionAdd === true) {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;

          const embed = new MessageEmbed()
            .setColor('#D92C2C')
            .setTitle('Reaction Removed')
            .setURL('https://discord.gg/83SAWkh')
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDescription(`Jump To Message: [Click Here](${messageReaction.message.url})\n\`\`\`autohotkey\nEmoji Name: ${messageReaction.emoji.name}\n(ID: ${messageReaction.emoji.id})\nEmoji Animated? ${messageReaction.emoji.animated ? 'Yes' : 'No'}\n---\nCategory Name:\n${message.channel.parent ? message.channel.parent.name : 'None'}\nChannel: #${message.channel.name}\n(ID: ${message.channel.id})\n\`\`\``)
            .setFooter(`Message ID: ${message.id} • Author ID: ${user.id}`)
            .setTimestamp();
          return logChannel.send(embed);
        } else {
          return;
        }
      });
    });
  }
};