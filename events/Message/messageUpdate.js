const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageUpdate'
    });
  }

  async execute(oldMessage, newMessage) {
    if (newMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;
    const fetched = await db.get(`log-channel_${newMessage.guild.id}.channelid`);
    const fetch = await db.get(`messageUpdate_${newMessage.guild.id}.value`);
    const ignoreFetch = await db.get(`ignoreChannel_${newMessage.guild.id}_${newMessage.channel.id}.channelid`);
    if (ignoreFetch === newMessage.channel.id) return;
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = newMessage.guild.channels.get(fetched);
      if (!logChannel) return;
      let oldContent = oldMessage.content;
      if (oldContent.length > 200) oldContent = oldContent.substring(0, 199) + '...';
      let newContent = newMessage.content;
      if (oldContent.length > 200) newContent = newContent.substring(0, 199) + '...';
      if (oldContent.length > 1000 || newContent.length > 1000) return;


      
      const embed = new MessageEmbed()
        .setColor('#7289DA')
        .setTitle('Message Updated')
        .setURL('https://discord.gg/EH7jKFH')
        .setDescription(`${newMessage.author.tag} (ID:${newMessage.author.id}) edited their message in ${oldMessage.channel}.`).setFooter(`ID: ${oldMessage.id}`)
        .setTimestamp()
        .addField('Previous Message', oldContent)
        .addField('Current Message', newContent)
        .addField('Jump to Message', `[Click Here](${newMessage.url})`);
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};