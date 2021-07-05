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

  async execute(ban) {
    const b = await db.get(ban.guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(ban.guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.guildBanRemove === null) return;
    if (a.events.guildBanRemove === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      if (!logChannel) return;
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#5cb85c')
        .setAuthor(`${ban.user.tag} has been unbanned from the server.`, ban.user.displayAvatarURL())
        .setDescription(`__Reason:__ ${ban.reason ? ban.reason : 'No Reason Provided'}\nThis user was unbanned at \`${moment(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``)
        .setFooter(`Watcher Event • Member Unbanned | User ID: ${ban.user.id}.`)
        .setTimestamp();
      return await logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  }
};