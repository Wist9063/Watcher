const BotEvent = require('../../handlers/event.js');
const { MessageEmbed } = require('discord.js');
const db = new (require('../../handlers/database.js'))();
const sender = require('../../modules/WebhookSender.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'channelCreate'
    });
  }

  async execute(channel) {
    if (channel.type === 'dm') return;
    const b = await db.get(channel.guild.id, this.mongod, 'guildSettings');
    const a = await db.get(channel.guild.id, this.mongod, 'events');
    if (a.events.channelCreate === null) return;
    if (a.events.channelCreate === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      this.eventsend++;
     
      if (channel.type === 'GUILD_TEXT') {
        const embed = new MessageEmbed()
          .setColor('#5cb85c')
          .setTitle(`Text Channel __**${channel.name}**__ has been created.`)
          .setDescription(`A new Text Channel has appeared. **${channel}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
          .setFooter(`Watcher Event • Text Channel Create | Channel ID: ${channel.id}`)
          .setTimestamp();
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      } else if (channel.type === 'GUILD_VOICE') {
        const embed = new MessageEmbed()
          .setColor('#5cb85c')
          .setTitle(`Voice Channel __**${channel.name}**__ has been created.`)
          .setDescription(`A new Voice Channel has appeared. **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
          .setFooter(`Watcher Event • Voice Channel Create | Channel ID: ${channel.id}`)
          .setTimestamp();
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      } else if (channel.type === 'GUILD_STAGE_VOICE') {
        const embed = new MessageEmbed()
          .setColor('#5cb85c')
          .setTitle(`Stage Channel __**${channel.name}**__ has been created.`)
          .setDescription(`A new Stage Channel has appeared. **${channel.name}** in ${channel.parent ? 'the catagory' : '**the default catagory.**'} ${channel.parent ? '**' + channel.parent.name + '**.' : ''}`)
          .setFooter(`Watcher Event • Voice Channel Create | Channel ID: ${channel.id}`)
          .setTimestamp();
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      } else if (channel.type === 'GUILD_CATEGORY') {
        const embed = new MessageEmbed()
          .setColor('#5cb85c')
          .setTitle('Category __**${channel.name}**__ has been created.')
          .setDescription(`**${channel.name}** has been created.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      } else {
        const embed = new MessageEmbed()
          .setColor('#5cb85c')
          .setTitle('Watcher Event - Unknown Channel Created')
          .setDescription(`An unknown channel type has been created: **${channel.name}**.`)
          .setFooter(`ID: ${channel.id}`)
          .setTimestamp();
        return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
      }
    } else {
      return;
    }
  }
};