const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildMemberRemove'
    });
  }

  async execute(member) {
    const guild = member.guild;
    await db.get(guild.id, this.mongod, 'events').then((a) => {
      if (a.events.guildMemberRemove === null) return;
      if (a.events.guildMemberRemove === true) {
        db.get(guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;

          const embed = new MessageEmbed()
            .setColor('#DD5449')
            .setAuthor(`${member.user.tag} has left the server.`, member.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
            .setDescription(` **${guild.name}** now has __${guild.memberCount}__ members.\nThis user joined discord on \`${moment(member.joinedAt).format('MMMM Do, YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
            .setFooter(`Watcher Event • User Left | ID: ${member.user.id}`)
            .setTimestamp();
          return logChannel.send(embed).catch(e => console.error(e));
        });
      } else {
        return;
      }
    });
  }
};