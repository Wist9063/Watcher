const { MessageEmbed } = require('discord.js');
const db = new (require('../../handlers/database.js'))();
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'settings',
      aliases: ['modules', 'mods']
    });
  }

  async execute(message) {
    const content = message.content.split(' ')[1];
    const a = await db.get(content ? content : message.guild.id, this.client.mongod, 'events');
    const b = await db.get(content ? content : message.guild.id, this.client.mongod, 'guildSettings');

    // Perm Check
    if (message.perm <= 0) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
    if (content && message.perm <= 9) return message.channel.send(`${message.author} | Insufficient permissions required to execute this part of the command. Remove the arguments and try again.`);

    if (content && !/^\d+$/.test(content)) return message.channel.send(`${message.author} | This isnt a valid number! Check arugments and try again.`);
    if (content && !this.client.guilds.resolve(content)) return message.channel.send(`${message.author} | This is not a valid guild ID! Check arugments and try again.`);

    const check = this.client.emojis.resolve('506673019838660608');
    const tick = this.client.emojis.resolve('506673020014952448');

    const embed = new MessageEmbed()
      .setColor('#428bca')
      .addField('💬 Message Settings', `**messageDelete**: ${a.events.messageDelete ? check : tick}\n**messageUpdate**: ${a.events.messageUpdate ? check : tick}\n**voiceStateUpdate**: ${a.events.voiceStateUpdate ? check : tick}\n**messageReactionAdd**: ${a.events.messageReactionAdd ? check : tick}\n**messageReactionRemove**: ${a.events.messageReactionRemove ? check : tick}`, true)
      .addField('🗒 Guild Settings', `**guildBanAdd**: ${a.events.guildBanAdd ? check : tick}\n**guidBanRemove**: ${a.events.guildBanRemove ? check : tick}\n**guildMemberAdd**: ${a.events.guildMemberAdd ? check : tick}\n**guildMemberUpdate**: ${a.events.guildMemberUpdate ? check : tick}\n**guildMemberRemove**: ${a.events.guildMemberRemove ? check : tick}\n**roleCreate**: ${a.events.roleCreate ? check : tick}\n**roleDelete**: ${a.events.roleDelete ? check : tick}`, true)
      .addField('⚙ Channel Settings', `**channelCreate**: ${a.events.channelCreate ? check : tick}\n**channelDelete**: ${a.events.channelDelete ? check : tick}`, true)
      .addField('👀 Watcher Settings', `**Log Channel**: ${b.wb.channelID ? `<#${b.wb.channelID}>` :  'None set.'}`, true)
      .setFooter('w!<setting> <value> - Edit a setting, or run w!enable-all to turn all settings on, and w!disable-all to turn all settings off.');

    return message.reply({ content: `${check} **Displaying module information for \`${content ? this.client.guilds.resolve(content).name : message.guild.name}\`**.`, embeds: [embed], allowedMentions: { repliedUser: false }});
  }
};