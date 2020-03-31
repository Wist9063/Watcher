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
      const logChannel = guild.channels.cache.get(fetched);
      if (!logChannel) return;
      if (!textOn) {
        const embed = new MessageEmbed()
          .setColor('#7289DA')
          .setAuthor(`${member.user.tag} has joined the server.`, member.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(` **${guild.name}** now has __${guild.memberCount}__ members.\nThis user joined discord on \`${moment(member.joinedAt).format('MMMM Do, YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
          .setFooter(`${member.user.tag}'s ID is ${member.user.id}.`)
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