const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildBanAdd'
    });
  }

  async execute(guild, user) {
    const fetched = await db.get(`guild_${guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${guild.id}.events.guildBanAdd`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = guild.channels.get(fetched);
      if (!logChannel) return;
      const member = guild.member(user);
      const embed = new MessageEmbed()
        .setColor('#D92C2C')
        .setAuthor(`${user.tag} has been banned.`, user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
        .setDescription(`**${user.tag}** has been banned in this server. This member joined the server at\n\`${moment.utc(member.joinedTimestamp).format('MMMM Do YYYY, h:mm:ss A')} (Universal Coordinated Time)\` and was banned at \`${moment.utc(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
        .setFooter(`${user.tag}'s ID is ${user.id}.`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};