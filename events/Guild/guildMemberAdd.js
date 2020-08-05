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
    await db.get(guild.id, this.mongod, 'events').then((a) => {
    // const textOn = await db.get(`guild_${guild.id}.textLog`);
      if (a.events === null) return;
      if (a.events.guildMemberAdd === null) return;
      if (a.events.guildMemberAdd === true) {
        db.get(guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;

          //if (!textOn) {
          const embed = new MessageEmbed()
            .setColor('#5cb85c')
            .setAuthor(`${member.user.tag} has joined the server.`, member.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
            .setDescription(` **${guild.name}** now has __${guild.memberCount}__ members.\nThis user joined discord on \`${moment(member.joinedAt).format('MMMM Do, YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
            .setFooter(`Watcher Event • User Joined | User ID: ${member.user.id}.`)
            .setTimestamp();
          return logChannel.send(embed);
          /* }  else if (textOn) {
        const message = `<:userjoined:509897784913035265> \`[${moment(new Date()).format('MMMM Do, YYYY, h:mm:ss A')}]\` ` + 
        `**${member.user.tag}** __(ID:${member.user.id})__ has joined the server. ` + 
        `**${guild.name}** now has __**${guild.memberCount}**__ members. ` +
        `This user's first day on discord was **${moment(member.user.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}**`;
        logChannel.send(message);
      } */
        });
      } else {
        return;
      }
    });
  }
};