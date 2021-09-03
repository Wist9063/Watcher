const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed } = require('discord.js');
const sender = require('../../modules/WebhookSender.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildBanAdd'
    });
  }

  async execute(ban) {
    const b = await db.get(ban.guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(ban.guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.guildBanAdd === null) return;
    if (a.events.guildBanAdd === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      this.eventsend++;

      const fetchedLogs = await ban.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
      });
      const banLog = fetchedLogs.entries.first();
      const embed = new MessageEmbed();

      if (banLog.target.id === ban.user.id) {
        embed
          .setColor('#DD5449')
          .setAuthor(`${ban.user.tag} has been banned from the server.`, ban.user.displayAvatarURL())
          .setDescription(`${ban.user} was banned by ${banLog.executor.tag}\n__Reason:__ ${banLog.reason ? banLog.reason : 'No Reason Provided'}\nThis member was banned at \`${moment(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``)
          .setFooter(`Watcher Event • Member Banned | Banned User's ID: ${ban.user.id} | Banned By (ID): ${banLog.executor.id}`)
          .setTimestamp();
      } else {
        embed
          .setColor('#DD5449')
          .setAuthor(`${ban.user.tag} has been banned from the server.`, ban.user.displayAvatarURL())
          .setDescription(`__Reason:__ ${ban.reason ? ban.reason : 'No Reason Provided'}\nThis member was banned at \`${moment(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\`\n*Could not fetch audit log data for this ban*`)
          .setFooter(`Watcher Event • Member Banned | Banned User's ID: ${ban.user.id}.`)
          .setTimestamp();
      }
      
      return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
    } else {
      return;
    }
  }
};