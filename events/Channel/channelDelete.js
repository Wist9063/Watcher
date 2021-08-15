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
      const logChannel = new WebhookClient({id: b.wb.wbID, token: b.wb.wbKey});
      this.eventsend++;

      if (channel.type === 'GUILD_TEXT') {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle(`Text Channel __**${channel.name}**__ has been deleted.`)
          .setDescription(`**${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
          .setFooter(`Watcher Event • Text Channel Delete | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send({ embeds: [embed] });
      } else if (channel.type === 'GUILD_VOICE ') {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle(`Voice Channel __**${channel.name}**__ has been deleted.`)
          .setDescription(`Voice channel **${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
          .setFooter(`Watcher Event • Voice Channel Delete | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send({ embeds: [embed] });
      } else if (channel.type === 'GUILD_STAGE_VOICE') {
        const embed = new MessageEmbed()
          .setColor('#DD5449')
          .setTitle(`Stage Channel __**${channel.name}**__ has been deleted.`)
          .setDescription(`Stage channel **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
          .setFooter(`Watcher Event • Voice Channel Create | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send({ embeds: [embed] });
      } else if (channel.type === 'GUILD_CATEGORY') {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle(`Category __**${channel.name}**__ has been deleted.`)
          .setDescription(`Cateogry **${channel.name}** has been deleted.`)
          .setFooter(`Watcher Event • Category Channel Delete | Channel ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send({ embeds: [embed] });
      } else {
        const embed = new MessageEmbed()
          .setColor('#DD5449').setTitle('Watcher Event - Unknown Channel Deleted')
          .setDescription(`An unknown channel type has been deleted: **${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return logChannel.send({ embeds: [embed] });
      }
    } else {
      return;
    }
  }
};