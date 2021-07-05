const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'roleCreate'
    });
  }

  async execute(role) {
    const b = await db.get(role.guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(role.guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.roleCreate === null) return;
    if (a.events.roleCreate === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#5cb85c')
        .setTitle(`The role "${role.name}" has been created.`)
        .setDescription(`**Name:** \`${role.name}\`\n**Hex Color:** \`${role.hexColor}\`\n**Position:** \`${role.position}\`\n**Mentionable?** \`${role.mentionable ? 'True' : 'False'}\`\n**Created At:** ${moment(role.createdAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)`)
        .setFooter(`Watcher Event • Role Created | Role ID: ${role.id}`)
        .setTimestamp();
      return await logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  }
};