const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'roleDelete'
    });
  }

  async execute(role) {
    await db.get(role.guild.id, this.mongod, 'events').then((a) => {
      if (a.events.roleCreate === null) return;
      if (a.events.roleCreate === true) {
        db.get(role.guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;
          this.eventsend++;

          const embed = new MessageEmbed()
            .setColor('#DD5449')
            .setTitle(`The role "${role.name}" has been deleted.`)
            .setURL('https://discord.gg/83SAWkh')
            .setDescription(`**Name:** \`${role.name}\`\n**Hex Color:** \`${role.hexColor}\`\n**Position Was?** \`${role.position}\`\n**Was Mentionable?** \`${role.mentionable ? 'True' : 'False'}\`\n**Deleted At:** \`${moment(new Date).format('MMMM Do YYYY, h:mm:ss A')} PST\``)
            .setFooter(`Watcher Event • Role Deleted | Role ID: ${role.id}`)
            .setTimestamp();
          return logChannel.send(embed);
        });
      } else {
        return;
      }
    });
  }
};