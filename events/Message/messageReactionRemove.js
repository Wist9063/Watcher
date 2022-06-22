const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed } = require('discord.js');
const sender = require('../../modules/WebhookSender.js');

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
      this.eventsend++;
      const limitSec = 2000;

      const embed = new MessageEmbed()
        .setColor('#DD5449')
        .setAuthor({name : `${user.tag} has removed a reaction to a message.`, iconURL: user.displayAvatarURL({dynamic: true})})
        .setDescription(`Jump To Message: [Click Here](${messageReaction.message.url})\n\`\`\`autohotkey\nEmoji Name: ${messageReaction.emoji.name}\n(ID: ${messageReaction.emoji.id})\nEmoji Animated? ${messageReaction.emoji.animated ? 'Yes' : 'No'}\n---\nCategory Name: ${message.channel.parent ? message.channel.parent.name : 'None'}\nChannel: #${message.channel.name}\n(ID: ${message.channel.id})\n\`\`\``)
        .setFooter({text : `Watcher Event • Reaction Removed | Message ID: ${message.id} • Author ID: ${user.id}`})
        .setTimestamp();
      setTimeout( function() {
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      }, limitSec);
    } else {
      return;
    }
  }
};