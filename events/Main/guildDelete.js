const BotEvent = require('../../handlers/event.js');
const { WebhookClient, MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildDelete'
    });
  }

  async execute(guild) {

    const hook = new WebhookClient('549476222686461972', this.config.wenhookToken);

    const embed = new MessageEmbed()
      .setColor('#D92C2C')
      .setTitle('Guild Delete')
      .setURL('https://discord.gg/EH7jKFH')
      .setDescription(`Watcher now at ***${this.client.guilds.size.toLocaleString()}*** guilds. Removed from ${guild.name} (ID:${guild.id}), which is owned by ${guild.owner.user.tag} (ID:${guild.owner.user.id}), has ${guild.memberCount} members, and ${guild.members.filter(mem => mem.user.bot).size} bots.\n\n\`\`\`autohotkey\n${moment(guild.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}\`\`\``)
      .setFooter(`ID: ${guild.id}`);
    return hook.send(embed);
  }
};