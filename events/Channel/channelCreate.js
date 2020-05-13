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
              .setColor('#7289DA').setTitle('Text Channel Created')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A text channel has been created: **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'voice') {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Voice Channel Created')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A voice channel has been created: **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else if (channel.type === 'category') {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Category Created')
              .setURL('https://discord.gg/83SAWkh')
              .setDescription(`A Category has been created: **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
              .setFooter(`ID: ${channel.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          } else {
            const embed = new MessageEmbed()
              .setColor('#7289DA').setTitle('Unknown Channel Created')
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