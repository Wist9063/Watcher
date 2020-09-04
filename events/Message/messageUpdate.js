const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageUpdate'
    });
  }

  async execute(oldMessage, newMessage) {
    if (newMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;

    await db.get(newMessage.guild.id, this.mongod, 'events').then((a) => {
      db.get(newMessage.guild.id, this.mongod, 'guildSettings').then((b) => {
        if (typeof b.ignoreChannel === undefined) return;
        if (b.ignoreChannel.includes(newMessage.channel.id) === true) return;

        if (a.events.messageUpdate === false) return;
        if (a.events.messageUpdate === true) {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;
          this.eventsend++;

          let oldContent = oldMessage.content;
          if (oldContent.length > 200) oldContent = oldContent.substring(0, 199) + '...';
          let newContent = newMessage.content;
          if (oldContent.length > 200) newContent = newContent.substring(0, 199) + '...';
          if (oldContent.length > 1000 || newContent.length > 1000) return;
      
          const embed = new MessageEmbed()
            .setColor('#5bc0de')
            .setAuthor(`${newMessage.author.tag} has edited a message.`, newMessage.author.displayAvatarURL())
            .setDescription(`Channel: ${oldMessage.channel}\nJump To Message: [Click Here](${newMessage.url})\n\n\`\`\`md\nPrevious Message\n====\n\n< ${oldContent} >\n\nCurrent Message\n====\n\n< ${newContent} >\`\`\``)
            .setFooter(`Watcher Event • Message Edited/Updated | Message ID: ${oldMessage.id}`)
            .setTimestamp();
          return logChannel.send(embed);
        } else {
          return;
        }
      });
    });
  }
};