const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const sender = require('../../modules/WebhookSender.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildMemberRemove'
    });
  }

  async execute(member) {
    const guild = member.guild;
    const b = await db.get(guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.guildMemberRemove === null) return;
    if (a.events.guildMemberRemove === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      this.eventsend++;

      const embed = new MessageEmbed()
        .setTimestamp();

      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
      });

      const check = fetchedLogs.entries.first();

      if (check.target.id === member.id) {
        embed.setColor('#DD5449')
          .setAuthor(`${member.user.tag} has been kicked from the server.`, member.user.displayAvatarURL({ dynamic: true }))
          .setDescription(`<@${member.id}> has been kicked from the server by ${check.executor}\n__Reason:__ ${check.reason ? check.reason : 'No Reason Found'}\n**${guild.name}** now has __${guild.memberCount}__ members.\nThis user was kicked on \`${moment(new Date).format('MMMM Do, YYYY, h:mm:ss A')} (Pacific Standard Time)\``)
          .setFooter(`Watcher Event • User Kicked | ID: ${member.user.id}`);
      } else {
        embed.setColor('#DD5449')
          .setAuthor(`${member.user.tag} has left the server from the server.`, member.user.displayAvatarURL({ dynamic: true }))
          .setDescription(`<@${member.id}>\n**${guild.name}** now has __${guild.memberCount}__ members.\nThis user joined discord on \`${moment(new Date).format('MMMM Do, YYYY, h:mm:ss A')} (Pacific Standard Time)\`\n\n*I wasn't able to fetch data from the audit log, so this user may have been kicked.*`)
          .setFooter(`Watcher Event • User Left | ID: ${member.user.id}`);
      }

      return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
    } else {
      return;
    }
  }
}; 