const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed } = require('discord.js');
const sender = require('../../modules/WebhookSender.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageUpdate'
    });
  }

  async execute(oldMessage, newMessage) {
    if (oldMessage.content === newMessage.content) return;

    const b = await db.get(newMessage.guild.id, this.mongod, 'guildSettings');
    const a = await db.get(newMessage.guild.id, this.mongod, 'events');
    //  if (!(b.ignoreChannel)) return;
    //if (b.ignoreChannel.includes(newMessage.channel.id) === true) return;

    if (a.events.messageUpdate === false) return;
    if (a.events.messageUpdate === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      this.eventsend++;

      let oldContent = oldMessage.content;
      if (oldContent.length > 200) oldContent = oldContent.substring(0, 199) + '...';
      let newContent = newMessage.content;
      if (oldContent.length > 200) newContent = newContent.substring(0, 199) + '...';
      if (oldContent.length > 1000 || newContent.length > 1000) return;
      const limitSec = 1000;
      
      const embed = new MessageEmbed()
        .setColor('#5bc0de')
        .setAuthor({name : `${newMessage.author.tag} has edited a message.`, iconURL: newMessage.author.displayAvatarURL({dynamic: true})})
        .setDescription(`Channel: ${oldMessage.channel}\nJump To Message: [Click Here](${newMessage.url})\n\n\`\`\`md\nPrevious Message\n====\n\n< ${oldContent} >\n\nCurrent Message\n====\n\n< ${newContent} >\`\`\``)
        .setFooter({text : `Watcher Event • Message Edited/Updated | Message ID: ${oldMessage.id}`})
        .setTimestamp();
      setTimeout( function() {
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      }, limitSec);
    } else {
      return;
    }
  }
};