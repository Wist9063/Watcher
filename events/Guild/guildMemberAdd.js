const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildMemberAdd'
    });
  }

  async execute(member) {
    const guild = member.guild;
    const fetched = await db.get(`guild_${guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${guild.id}.events.guildMemberAdd`);
    const textOn = await db.get(`guild_${guild.id}.textLog`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = guild.channels.get(fetched);
      if (!logChannel) return;
      if (!textOn) {
        const embed = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle('Member Joined')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`${member.user.tag} (ID:${member.user.id}) has joined. **${guild.name}** now has ${guild.memberCount} members.\n\n**Registered:**\n\`\`\`autohotkey\n${moment(member.user.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}\`\`\``)
          .setFooter(`ID: ${member.user.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (textOn) {
        const message = `<:userjoined:509897784913035265> \`[${moment(new Date()).format('MMMM Do, YYYY, h:mm:ss A')}]\` ` + 
        `**${member.user.tag}** __(ID:${member.user.id})__ has joined the server. ` + 
        `**${guild.name}** now has __**${guild.memberCount}**__ members. ` +
        `This user's first day on discord was **${moment(member.user.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}**`;
        logChannel.send(message);
      }
    } else {
      return;
    }
  }
};