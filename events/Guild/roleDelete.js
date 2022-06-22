const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const sender = require('../../modules/WebhookSender.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'roleDelete'
    });
  }

  async execute(role) {
    const b = await db.get(role.guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(role.guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.roleCreate === null) return;
    if (a.events.roleCreate === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#DD5449')
        .setTitle(`The role "${role.name}" has been deleted.`)
        .setDescription(`**Name:** \`${role.name}\`\n**Hex Color:** \`${role.hexColor}\`\n**Position Was?** \`${role.position}\`\n**Was Mentionable?** \`${role.mentionable ? 'True' : 'False'}\`\n**Deleted At:** \`${moment(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``)
        .setFooter({text: `Watcher Event • Role Deleted | Role ID: ${role.id}`})
        .setTimestamp();
      return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
    } else {
      return;
    }
  }
};