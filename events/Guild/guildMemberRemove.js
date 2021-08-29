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
        .setColor('#DD5449')
        .setAuthor(`${member.user.tag} has left the server.`, member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`<@${member.id}>\n**${guild.name}** now has __${guild.memberCount}__ members.\nThis user joined discord on \`${moment(member.joinedAt).format('MMMM Do, YYYY, h:mm:ss A')} (Pacific Standard Time)\``)
        .setFooter(`Watcher Event • User Left | ID: ${member.user.id}`)
        .setTimestamp();
      return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
    } else {
      return;
    }
  }
};