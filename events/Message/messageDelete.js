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
      let text;
      let text2 = '';
      const embed2 = new MessageEmbed();
      const regeximg = /image+\/[-+.\w]+/g;
      let contentAttachment = message.attachments.first();
      const contentEmbed = message.embeds;

      // attachment info
      if (!contentAttachment) {contentAttachment = false;}
      if (contentAttachment) {text = ' attached';} else {text = '';}
      if (contentAttachment) {text2 = `__Attachment Name:__ [${contentAttachment.name}](${contentAttachment.proxyURL})\n\n`;}
      // embed info
      if (contentEmbed[0] && contentEmbed[0].title) {embed2.setTitle(contentEmbed[0].title); text = ' embeded';}
      if (contentEmbed[0] && contentEmbed[0].url) {embed2.setURL(contentEmbed[0].url);}
      if (contentEmbed[0] && contentEmbed[0].thumbnail) {embed2.setThumbnail(contentEmbed[0].thumbnail.proxyURL);}
      if (contentEmbed[0] && contentEmbed[0].description) {text2 = '__Embed Description:__ ' + contentEmbed[0].description + '\n\n';} 
      else if (contentEmbed[0]) {text2 = '**No Embed Description**\n\n';} 

      if (contentValue.length > 500) contentValue = contentValue.substring(0, 499) + '...';
      if (text2.length > 500) text2 = text2.substring(0, 499) + '...';

      embed2.setColor('#DD5449');
      embed2.setAuthor(`${message.author.tag}'s${text} message has been deleted.`, message.author.displayAvatarURL());
      embed2.setDescription(`${text2}__Message Content:__ \`${contentValue ? contentValue : 'No Text'}\`${contentEmbed[1] ? '\n\n**More than one embed has been detected in this message.**' : ''}`);
      embed2.setImage(regeximg.test(contentAttachment.contentType) ? contentAttachment.proxyURL : null);
      embed2.setFooter(`Watcher Event • Message Deleted | Author ID: ${message.author.id} • Message ID: ${message.id}`);
      embed2.setTimestamp();

      return await logChannel.send({ embeds: [embed2] });
    } else {
      return;
    }
  }
};