const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

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
        .setColor('#D92C2C').setTitle('Member Unbanned').setURL('https://discord.gg/83SAWkh').setDescription(`${user.tag} (ID:${user.id}) was unbanned.`).setFooter(`ID: ${user.id}`).setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};