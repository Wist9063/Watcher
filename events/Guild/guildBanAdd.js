const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildBanAdd'
    });
  }

  async execute(guild, user) {
    await db.get(guild.id, this.mongod, 'events').then((a) => {
      if (a.events.guildBanAdd === null) return;
      if (a.events.guildBanAdd === true) {
        db.get(guild.id, this.mongod, 'guildSettings').then((b) => {
          if (b.wb.wbID === null || b.wb.wbKey === null) return;
          const logChannel = new WebhookClient(b.wb.wbID, b.wb.wbKey);
          if (!logChannel) return;

          const embed = new MessageEmbed()
            .setColor('#D92C2C')
            .setAuthor(`${user.tag} has been banned.`, user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
            .setDescription(`**${user.tag}** has been banned in this server. This member was banned at \`${moment.utc(new Date).format('MMMM Do YYYY, h:mm:ss A')} (Universal Coordinated Time)\``)
            .setFooter(`${user.tag}'s ID is ${user.id}.`)
            .setTimestamp();
          return logChannel.send(embed);
        });
      } else {
        return;
      }
    });
  }
};