const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed } = require('discord.js');
const sender = require('../../modules/WebhookSender.js');
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
      this.eventsend++;

      const embed = new MessageEmbed()
        .setColor('#5cb85c')
        .setAuthor({name : `${member.user.tag} has joined the server.`, iconURL: member.user.displayAvatarURL({dynamic: true})})
        .setDescription(`<@${member.id}>\n**${guild.name}** now has __${guild.memberCount}__ members.\nJoined discord on \`${moment(member.user.createdAt).format('MMMM Do, YYYY, h:mm:ss A')} (Pacific Standard Time)\`\nThat was **${moment(member.user.createdAt).fromNow()}**.`)
        .setFooter({text: `Watcher Event • User Joined | User ID: ${member.user.id}`})
        .setTimestamp();
      return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
    } else {
      return;
    }
  }
};