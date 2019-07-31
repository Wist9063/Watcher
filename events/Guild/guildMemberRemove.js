const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
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
    const fetched = await db.get(`guild_${guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${guild.id}.events.guildMemberRemove`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = guild.channels.get(fetched);
      if (!logChannel) return;
      const embed = new MessageEmbed()
        .setColor('#D92C2C')
        .setTitle('Member Left')
        .setURL('https://discord.gg/83SAWkh')
        .setDescription(`${member.user.tag} (ID:${member.user.id}) has left. **${guild.name}** now has ${guild.memberCount} members.\n\n**User registered at:**\n\`\`\`autohotkey\n${moment(member.user.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}\`\`\``)
        .setFooter(`ID: ${member.user.id}`)
        .setTimestamp();
      return logChannel.send(embed).catch(e => console.error(e));
    } else {
      return;
    }
  }
};