const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildBanRemove'
    });
  }

  async execute(guild, user) {
    const b = await db.get(guild.id, this.mongod, 'guildSettings');
    const a = await db.get(guild.id, this.mongod, 'events');
    if (a.events.guildBanRemove === null) return;
    if (a.events.guildBanRemove === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      if (!logChannel) return;
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#DD5449')
        .setAuthor(`${user.tag} has been unbanned.`, user.displayAvatarURL())
        .setDescription(`**${user.tag}** has been unbanned in this server. This user was unbanned at \`${moment.utc(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
        .setFooter(`Watcher Event • Member Unbanned | User ID: ${user.id}.`)
        .setTimestamp();
      return logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  }
};