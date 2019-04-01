const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'roleCreate'
    });
  }

  async execute(role) {
    const fetched = await db.get(`guild_${role.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${role.guild.id}.events.roleCreate`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = role.guild.channels.get(fetched);
      if (!logChannel) return;
      const embed = new MessageEmbed()
        .setColor('#7289DA')
        .setTitle('Role Created')
        .setURL('https://discord.gg/83SAWkh')
        .setDescription(`**Name:** \`${role.name}\`\n**Hex Color:** \`${role.hexColor}\`\n**Position:** \`${role.position}\`\n**Mentionable?** \`${role.mentionable ? 'True' : 'False'}\`\n\n**Created At:** \`\`\`autohotkey\n${moment(role.createdAt).format('MMMM Do YYYY, h:mm:ss A')} PST\`\`\``)
        .setFooter(`Role ID: ${role.id}`)
        .setTimestamp();
      return logChannel.send(embed);
    } else {
      return;
    }
  }
};