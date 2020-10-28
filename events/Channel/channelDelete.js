const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'channelDelete'
    });
  }

  async execute(channel) {
    const b = await db.get(channel.guild.id, this.mongod, 'guildSettings');
    const a = await db.get(channel.guild.id, this.mongod, 'events');
    if (a.events.channelDelete === null) return;
    if (a.events.channelDelete === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      if (!logChannel) return;
      this.eventsend++;

      if (channel.type === 'text') {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle(`Text Channel __**${channel.name}**__ has been deleted.`)
          .setDescription(`**${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
          .setFooter(`Watcher Event • Text Channel Delete | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (channel.type === 'voice') {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle(`Voice Channel __**${channel.name}**__ has been deleted.`)
          .setDescription(`Voice channel **${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
          .setFooter(`Watcher Event • Voice Channel Delete | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (channel.type === 'category') {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle(`Category __**${channel.name}**__ has been deleted.`)
          .setDescription(`Cateogry **${channel.name}** has been deleted.`)
          .setFooter(`Watcher Event • Category Channel Delete | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle('Watcher Event - Unknown Channel Deleted')
          .setDescription(`An unknown channel type has been deleted: **${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      }
    } else {
      return;
    }
  }
};