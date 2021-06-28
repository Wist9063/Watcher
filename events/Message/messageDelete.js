const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageDelete'
    });
  }

  async execute(message) {
    if (message.author.bot) return;
    const b = await db.get(message.guild.id, this.mongod, 'guildSettings');
    const a = await db.get(message.guild.id, this.mongod, 'events');
    // if (b.ignoreChannel.includes(message.channel.id) === true) return;
    if (a.events.messageDelete === false) return;

    if (a.events.messageDelete === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      this.eventsend++;

      let contentValue = message.content;
      if (contentValue.length > 500) contentValue = contentValue.substring(0, 499) + '...';
      const embed = new MessageEmbed()
        .setColor('#DD5449')
        .setAuthor(`${message.author.tag}'s message has been deleted.`, message.author.displayAvatarURL())
        .setDescription(`In channel: ${message.channel}\n\`\`\`md\nMessage Below\n====\n\n< ${contentValue} >\`\`\``)
        .setFooter(`Watcher Event • Message Deleted | Author ID: ${message.author.id} • Message ID: ${message.id}`)
        .setTimestamp();
      return logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  }
};