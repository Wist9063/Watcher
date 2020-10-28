const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildBanAdd'
    });
  }

  async execute(guild, user) {
    const b = await db.get(guild.id, this.mongod, 'guildSettings');
    const a = await db.get(guild.id, this.mongod, 'events');
    if (a.events.guildBanAdd === null) return;
    if (a.events.guildBanAdd === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      if (!logChannel) return;
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#5cb85c')
        .setAuthor(`${user.tag} has been banned.`, user.displayAvatarURL())
        .setDescription(`**${user.tag}** has been banned in this server. This member was banned at \`${moment.utc(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
        .setFooter(`Watcher Event • Member Banned | User ID: ${user.id}.`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};