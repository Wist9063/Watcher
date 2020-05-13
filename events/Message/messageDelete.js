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
    await db.get(message.guild.id, this.mongod, 'events').then((a) => {
      db.get(message.guild.id, this.mongod, 'guildSettings').then((b) => {
        if (b.ignoreChannel.includes(message.channel.id) === true) return;
        if (a.events.messageDelete === false) return;

        if (a.events.messageDelete === true) {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
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
      });
    });
  }
};