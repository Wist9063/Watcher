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
    if (!systemChannel) return;
    if (!systemChannel.permissionsFor(guild.me.id).has('SEND_MESSAGES')) return;
    if (systemChannel) return systemChannel.send('Hello there, I was invited by a guild admin! 👀 To start using Watcher, run the command `w!setup` & `w!help` to get started! If you are facing any issues setting up the bot, please join our support server: **https://discord.gg/83SAWkh**.').catch(() => { return; });
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
  /*
  async updateSites() {
    // https://discordbots.group/
    snekfetch.post('https://discordbots.group/api/bot/505571539333152781')
      .set('Content-Type', 'application/json')
      .set('authorization', 'f2f69c9437f182c605239157b6c715f405b2b602963cd0524ce0bd4cf90568e5f3293845877f13191ef59e98dc45dce9255629ce117696bbbea9ba16058911ed')
      .send({ 'count': client.guilds.size })
      .catch(err => console.log(err));

    // https://botsfordiscord.com/
    snekfetch.post('https://botsfordiscord.com/api/bot/505571539333152781')
      .set('Content-Type', 'application/json')
      .set('authorization', 'b36c59d9f7b2be22be389a1ae7710d10fd978cc803c92b7d38cbd7ccfea02ff515a8ef528516a1d9ce5cb38ee3e960738c3c23a97efd900f7a262b0cd5d1ae8a')
      .send({ 'server_count': client.guilds.size })
      .catch(err => console.log(err));
  }
  */
};