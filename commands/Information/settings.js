const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'settings',
      aliases: ['modules', 'mods']
    });
  }

  execute(message) {
    const content = message.content.split(' ')[1];

    // Perm Check
    if (message.perm <= 0) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
    if (content && message.perm <= 9) return message.channel.send(`${message.author} | Insufficient permissions required to execute this part of the command. Remove the arguments and try again.`);

    if (content && !/^\d+$/.test(content)) return message.channel.send(`${message.author} | This isnt a valid number! Check arugments and try again.`);
    if (content && !this.client.guilds.resolve(content)) return message.channel.send(`${message.author} | This is not a valid guild ID! Check arugments and try again.`);

    const check = this.client.emojis.resolve('506673019838660608');
    const tick = this.client.emojis.resolve('506673020014952448');
      
    // LIST OF EVENTS
    let logChannel = db.get(`guild_${content ? content : message.guild.id}.logChannel.id`);
    //let textLog = db.get(`guild_${content ? content : message.guild.id}.textLog`);
    let channelCreate = db.get(`guild_${content ? content : message.guild.id}.events.channelCreate`);
    let channelDelete = db.get(`guild_${content ? content : message.guild.id}.events.channelDelete`);
    let guildBanAdd = db.get(`guild_${content ? content : message.guild.id}.events.guildBanAdd`);
    let guildBanRemove = db.get(`guild_${content ? content : message.guild.id}.events.guildBanRemove`);
    let guildMemberAdd = db.get(`guild_${content ? content : message.guild.id}.events.guildMemberAdd`);
    let guildMemberUpdate = db.get(`guild_${content ? content : message.guild.id}.events.guildMemberUpdate`);
    let guildMemberRemove = db.get(`guild_${content ? content : message.guild.id}.events.guildMemberRemove`);
    let messageDelete = db.get(`guild_${content ? content : message.guild.id}.events.messageDelete`);
    let messageUpdate = db.get(`guild_${content ? content : message.guild.id}.events.messageUpdate`);
    let voiceStateUpdate = db.get(`guild_${content ? content : message.guild.id}.events.voiceStateUpdate`);
    let messageReactionAdd = db.get(`guild_${content ? content : message.guild.id}.events.messageReactionAdd`);
    let messageReactionRemove = db.get(`guild_${content ? content : message.guild.id}.events.messageReactionRemove`);
    let roleCreate = db.get(`guild_${content ? content : message.guild.id}.events.roleCreate`);

    // FETCH VALUES
    if (logChannel) logChannel = `<#${logChannel}>`;
    else logChannel = 'None set.';
    if (channelCreate) channelCreate = check;
    else channelCreate = tick;
    //if (textLog) textLog = check;
    //else textLog = tick;
    if (channelDelete) channelDelete = check;
    else channelDelete = tick;
    if (guildBanAdd) guildBanAdd = check;
    else guildBanAdd = tick;
    if (guildBanRemove) guildBanRemove = check;
    else guildBanRemove = tick;
    if (guildMemberAdd) guildMemberAdd = check;
    else guildMemberAdd = tick;
    if (guildMemberUpdate) guildMemberUpdate = check;
    else guildMemberUpdate = tick;
    if (guildMemberRemove) guildMemberRemove = check;
    else guildMemberRemove = tick;
    if (messageDelete) messageDelete = check;
    else messageDelete = tick;
    if (messageUpdate) messageUpdate = check;
    else messageUpdate = tick;
    if (voiceStateUpdate) voiceStateUpdate = check;
    else voiceStateUpdate = tick;
    if (messageReactionAdd) messageReactionAdd = check;
    else messageReactionAdd = tick;
    if (messageReactionRemove) messageReactionRemove = check;
    else messageReactionRemove = tick;
    if (roleCreate) roleCreate = check;
    else roleCreate = tick;

    const embed = new MessageEmbed()
      .addField('⚙ Channel Settings', `**Log Channel**: ${logChannel}\n**channelCreate**: ${channelCreate}\n**channelDelete**: ${channelDelete}`, true)
      .addField('💬 Message Settings', `**messageDelete**: ${messageDelete}\n**messageUpdate**: ${messageUpdate}\n**voiceStateUpdate**: ${voiceStateUpdate}\n**messageReactionAdd**: ${messageReactionAdd}\n**messageReactionRemove**: ${messageReactionRemove}`, true)
      .addField('🗒 Guild Settings', `**guildBanAdd**: ${guildBanAdd}\n**guidBanRemove**: ${guildBanRemove}\n**guildMemberAdd**: ${guildMemberAdd}\n**guildMemberUpdate**: ${guildMemberUpdate}\n**guildMemberRemove**: ${guildMemberRemove}\n **roleCreate**: ${roleCreate}`, true)
      .setFooter('w!<setting> <value> - Edit a setting, or run w!enable-all to turn all settings on, and w!disable-all to turn all settings off. This message will delete in 30 seconds.');

    return message.channel.send(`${check} **Displaying module information for \`${content ? this.client.guilds.resolve(content).name : message.guild.name}\`**.`, embed);
  }
};