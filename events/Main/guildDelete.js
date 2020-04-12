const BotEvent = require('../../handlers/event.js');
const { WebhookClient, MessageEmbed } = require('discord.js');
const moment = require('moment');
const momenttime = require('moment-timezone');
const db = require('quick.db');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildDelete'
    });
  }

  async execute(guild) {


    await db.delete(`guild_${guild.id}`);

    const hook = new WebhookClient('549476222686461972', this.config.webhookToken);

    console.log(`[${momenttime(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] | I've left a guild. Added from ${guild.name} (ID:${guild.id}), which is owned by ${guild.owner.user.tag} (ID:${guild.owner.user.id}), has ${guild.memberCount} members.`);

    const embed = new MessageEmbed()
      .setColor('#D92C2C')
      .setTitle('Guild Delete')
      .setURL('https://discord.gg/83SAWkh')
      .setDescription(`Watcher now at **${this.guilds.size}** guilds. Removed from ${guild.name} (ID:${guild.id}), which is owned by ${guild.owner.user.tag} (ID:${guild.owner.user.id}), has ${guild.memberCount} members, and ${guild.members.cache.filter(mem => mem.user.bot).size} bots.\n\n\`\`\`autohotkey\n${moment(guild.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}\`\`\``)
      .setFooter(`ID: ${guild.id}`);
    return hook.send(embed);
  }
};