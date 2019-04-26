const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildMemberUpdate'
    });
  }

  async execute(oldMember, newMember) {
    if (oldMember.user.bot) return;
    const fetched = await db.get(`guild_${newMember.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${newMember.guild.id}.events.channelDelete`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = newMember.guild.channels.get(fetched);
      if (!logChannel) return;
      if (oldMember.nickname != newMember.nickname) {
        const embed = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle('Member Updated | Nickname')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`${newMember.user.tag} (ID:${newMember.user.id}) edited their nickname.`)
          .setFooter(`ID: ${newMember.user.id}`)
          .setTimestamp()
          .addField('Previous Nickname', oldMember.nickname, true)
          .addField('Current Nickname', newMember.nickname, true);
        return logChannel.send(embed);
      } else if (oldMember.roles.size != newMember.roles.size) {
        const oldRoles = oldMember.roles.map(r => r).join(' ').replace('@everyone', ' ');
        if (oldRoles.length > 99) oldRoles.substring(0, 100) + ', and more.';
        const newRoles = newMember.roles.map(r => r).join(' ').replace('@everyone', ' ');
        if (newRoles.length > 99) newRoles.substring(0, 100) + ', and more.';
        const embed = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle('Member Updated | Roles')
          .setURL('https://discord.gg/83SAWkh')
          .setDescription(`${newMember.user.tag} (ID:${newMember.user.id}) edited their roles.`)
          .addField('Previous Roles', `󠂪󠂪${oldRoles}`)
          .addField('Current Roles', `󠂪󠂪${newRoles}`)
          .setFooter(`ID: ${newMember.user.id}`)
          .setTimestamp();
        return logChannel.send(embed);
      }
    } else {
      return;
    }
  }
};