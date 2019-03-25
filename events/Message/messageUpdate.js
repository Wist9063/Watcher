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
    const fetched = await db.get(`guild_${newMessage.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${newMessage.guild.id}.events.messageUpdate`);
    const ignoreFetch = await db.get(`guild_${newMessage.guild.id}.ignoreChannel.${newMessage.channel.id}`);
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
        .setTitle('Message Edited/Updated')
        .setURL('https://discord.gg/83SAWkh')
        .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL())
        .setDescription(`Channel: ${oldMessage.channel}\nJump To Message: [Click Here](${newMessage.url})\n\n\`\`\`md\nPrevious Message\n====\n\n< ${oldContent} >\n\nCurrent Message\n====\n\n< ${newContent} >\`\`\``)
        .setFooter(`Message ID: ${oldMessage.id}`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};