const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildBanRemove'
    });
  }

  async execute(guild, user) {
    const fetched = await db.get(`guild_${guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${guild.id}.events.guildBanRemove`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = guild.channels.get(fetched);
      if (!logChannel) return;
      const embed = new MessageEmbed()
        .setColor('#008000')
        .setAuthor(`${user.tag} has been unbanned.`, user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
        .setDescription(`**${user.tag}** has been unbanned in this server. This user was unbanned at \`${moment.utc(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
        .setFooter(`${user.tag}'s ID is ${user.id}.`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};