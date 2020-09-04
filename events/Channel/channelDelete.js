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
    await db.get(channel.guild.id, this.mongod, 'events').then((a) => {

      if (a.events.channelDelete === null) return;
      if (a.events.channelDelete === true) {
        db.get(channel.guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;
          this.datadog.increment('watcher_event_send');

          if (channel.type === 'text') {
            const embed = new MessageEmbed()
              .setColor('#DD5449').setTitle(`Text Channel __**${channel.name}**__ has been deleted.`)
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`**${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
              .setFooter(`Watcher Event • Text Channel Delete | Channel ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'voice') {
            const embed = new MessageEmbed()
              .setColor('#DD5449').setTitle(`Voice Channel __**${channel.name}**__ has been deleted.`)
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`Voice channel **${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''} has been deleted.`)
              .setFooter(`Watcher Event • Voice Channel Delete | Channel ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'category') {
            const embed = new MessageEmbed()
              .setColor('#DD5449').setTitle(`Category __**${channel.name}**__ has been deleted.`)
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`Cateogry **${channel.name}** has been deleted.`)
              .setFooter(`Watcher Event • Category Channel Delete | Channel ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else {
            const embed = new MessageEmbed()
              .setColor('#DD5449').setTitle('Watcher Event - Unknown Channel Deleted')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`An unknown channel type has been deleted: **${channel.name}**.`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          }

        });
      } else {
        return;
      }
    });
  }
};