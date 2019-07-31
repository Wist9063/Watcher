const BotEvent = require('../../handlers/event.js');
const { WebhookClient, MessageEmbed } = require('discord.js');
const moment = require('moment');
const db = require('quick.db');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'guildCreate'
    });
    //this.updateSites();
  }
  async execute(guild) {
    

    // dont remove v lol
    const systemChannel = guild.channels.get(guild.systemChannelID);
    if (!systemChannel);
    if (systemChannel && guild.me.permissionsIn(systemChannel).has('SEND_MESSAGES')) {
      systemChannel.send('Hello there, I was invited by a guild admin! 👀 To start using Watcher, run the command `w!setup` & `w!help` to get started! If you are facing any issues setting up the bot, please join our support server: **https://discord.gg/83SAWkh**.').catch(() => { return; });
    }
    
    await db.set(`guild_${guild.id}.enabled`, false);
    await db.set(`guild_${guild.id}.guildID`, { id: guild.id });

    const hook = new WebhookClient('549476222686461972', this.config.webhookToken);

    const embed = new MessageEmbed()
      .setColor('#18f400')
      .setTitle('Guild Create')
      .setURL('https://discord.gg/83SAWkh')
      .setDescription(`Watcher now at **${this.guilds.size}** guilds. Added from ${guild.name} (ID:${guild.id}), which is owned by ${guild.owner.user.tag} (ID:${guild.owner.user.id}), has ${guild.memberCount} members, and ${guild.members.filter(mem => mem.user.bot).size} bots.\n\n\`\`\`autohotkey\n${moment(guild.createdAt).format('MMMM Do, YYYY, h:mm:ss A')}\`\`\``)
      .setFooter(`ID: ${guild.id}`);
    return hook.send(embed);
  }
};