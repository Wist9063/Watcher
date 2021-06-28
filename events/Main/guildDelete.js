const BotEvent = require('../../handlers/event.js');
const { WebhookClient, MessageEmbed } = require('discord.js');
const db = new (require('../../handlers/database.js'))();
const moment = require('moment');
const momenttime = require('moment-timezone');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildDelete'
    });
  }

  async execute(guild) {

    await db.delete(this.mongod, 'guildSettings', {gID: guild.id});
    await db.delete(this.mongod, 'events', {gID: guild.id});

    const hook = new WebhookClient('549476222686461972', this.config.webhookToken);

    console.log(`[${momenttime(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] | I've left a guild. Added from ${guild.name} (ID:${guild.id}), which is owned by ID:${guild.ownerID}, has ${guild.memberCount} members.`);

    const embed = new MessageEmbed()
      .setColor('#DD5449')
      .setTitle('Guild Delete')
      
      .setDescription(`Watcher now at **${this.guilds.cache.size}** guilds. Removed from ${guild.name} (ID:${guild.id}), which is owned by ID:${guild.ownerID}, has ${guild.memberCount} members, and ${guild.members.cache.filter(mem => mem.user.bot).size} bots.\n\n\`\`\`autohotkey\n${moment(guild.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}\`\`\``)
      .setFooter(`ID: ${guild.id}`);
    return hook.send({ embeds: [embed] });
  }
};