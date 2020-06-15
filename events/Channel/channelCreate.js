const BotEvent = require('../../handlers/event.js');
const { MessageEmbed, WebhookClient } = require('discord.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'channelCreate'
    });
  }

  async execute(channel) {
    if (channel.type === 'dm') return;
    await db.get(channel.guild.id, this.mongod, 'events').then((a) => {
      if (a.events.channelCreate === null) return;
      if (a.events.channelCreate === true) {
        db.get(channel.guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;

     
          if (channel.type === 'text') {
            const embed = new MessageEmbed()
              .setColor('#7289DA')
              .setTitle(`Text Channel __**${channel.name}**__ has been created.`)
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A new Text Channel has appeared. **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`Watcher Event • Text Channel Create | Channel ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'voice') {
            const embed = new MessageEmbed()
              .setColor('#7289DA')
              .setTitle(`Voice Channel __**${channel.name}**__ has been created.`)
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A new Voice Channel has appeared. **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`Watcher Event • Voice Channel Create | Channel ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'category') {
            const embed = new MessageEmbed()
              .setColor('#7289DA')
              .setTitle('Category __**${channel.name}**__ has been created.')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`**${channel.name}** has been created.`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else {
            const embed = new MessageEmbed()
              .setColor('#7289DA')
              .setTitle('Watcher Event - Unknown Channel Created')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`An unknown channel type has been created: **${channel.name}**.`)
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