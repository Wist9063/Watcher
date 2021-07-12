const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildMemberAdd'
    });
  }

  async execute(member) {
    const guild = member.guild;
    const b = await db.get(guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.guildMemberAdd === null) return;
    if (a.events.guildMemberAdd === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#5cb85c')
        .setAuthor(`${member.user.tag} has joined the server.`, member.user.displayAvatarURL())
        .setDescription(` **${guild.name}** now has __${guild.memberCount}__ members.\nJoined discord on \`${moment(member.user.createdAt).format('MMMM Do, YYYY, h:mm:ss A')} (Pacific Standard Time)\`\nThat was **${moment(member.user.createdAt).fromNow()}**.`)
        .setFooter(`Watcher Event • User Joined | User ID: ${member.user.id}`)
        .setTimestamp();
      return await logChannel.send({ embeds: [embed] });
    } else {
      return;
    }
  }
};