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

          if (channel.type === 'text') {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Text Channel Deleted')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A text channel has been deleted: **${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'voice') {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Voice Channel Deleted')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A voice channel has been deleted: **${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'category') {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Category Deleted')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A Category has been deleted: **${channel.name}** in ${channel.parent ? 'the catagory' : '**default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Unknown Channel Deleted')
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