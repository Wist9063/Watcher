const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildMemberUpdate'
    });
  }

  async execute(oldMember, newMember) {
    if (oldMember.user.bot) return;
    await db.get(newMember.guild.id, this.mongod, 'events').then((a) => {
      if (a === undefined) return;
      if (a.events.guildMemberUpdate === null) return;
      if (a.events.guildMemberUpdate === true) {
        db.get(newMember.guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;
          this.datadog.increment('watcher_event_send');

          if (oldMember.nickname != newMember.nickname) {
            const embed = new MessageEmbed()
              .setColor('#5bc0de')
              .setAuthor(`${newMember.user.tag} edited their nickname.`, newMember.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
              .setDescription(`${newMember.user.tag} (ID:${newMember.user.id}) has edited their nickname.`)
              .setFooter(`Watcher Event • Nickname Change | User ID: ${newMember.user.id}`)
              .setTimestamp()
              .addField('Previous Nickname', oldMember.nickname === null ? oldMember.user.tag : oldMember.nickname, true)
              .addField('Current Nickname', newMember.nickname === null ? newMember.user.tag : newMember.nickname, true);
            return logChannel.send(embed);
          } else if (oldMember.roles.cache.size != newMember.roles.cache.size) {
            const oldRoles = oldMember.roles.cache.map(r => r).join(' ').replace('@everyone', ' ');
            if (oldRoles.length > 99) oldRoles.substring(0, 100) + ', and more.';
            const newRoles = newMember.roles.cache.map(r => r).join(' ').replace('@everyone', ' ');
            if (newRoles.length > 99) newRoles.substring(0, 100) + ', and more.';
            const embed = new MessageEmbed()
              .setColor('#5bc0de')
              .setAuthor(`${newMember.user.tag} edited their roles.`, newMember.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
              .setDescription(`${newMember.user.tag} (ID:${newMember.user.id}) has edited their roles.`)
              .addField('Previous Roles', `󠂪󠂪${oldRoles}`)
              .addField('Current Roles', `󠂪󠂪${newRoles}`)
              .setFooter(`Watcher Event • Roles Edited | User ID: ${newMember.user.id}`)
              .setTimestamp();
            return logChannel.send(embed);
          }
        });
      } else {
        return;
      }
    });
  }
};