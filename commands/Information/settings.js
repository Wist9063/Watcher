const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const Command = require('../../handlers/command.js');
const check = '<:yes:501906738119835649>';
const tick = '<:no:501906738224562177>';

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'settings',
      aliases: ['modules', 'mods']
    });
  }

  execute(message) {
    if (message.perm <= 0) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
        
    // LIST OF EVENTS
    let logChannel = db.get(`log-channel_${message.guild.id}.channelid`);
    let channelCreate = db.get(`channelCreate_${message.guild.id}.value`);
    let channelDelete = db.get(`channelDelete_${message.guild.id}.value`);
    let guildBanAdd = db.get(`guildBanAdd_${message.guild.id}.value`);
    let guildBanRemove = db.get(`guildBanRemove_${message.guild.id}.value`);
    let guildMemberAdd = db.get(`guildMemberAdd_${message.guild.id}.value`);
    let guildMemberUpdate = db.get(`guildMemberUpdate_${message.guild.id}.value`);
    let guildMemberRemove = db.get(`guildMemberRemove_${message.guild.id}.value`);
    let messageDelete = db.get(`messageDelete_${message.guild.id}.value`);
    let messageUpdate = db.get(`messageUpdate_${message.guild.id}.value`);
    let voiceStateUpdate = db.get(`voiceStateUpdate_${message.guild.id}.value`);
    let messageReactionAdd = db.get(`messageReactionAdd_${message.guild.id}.value`);

    // FETCH VALUES
    if (logChannel) logChannel = `<#${logChannel}>`;
    else logChannel = 'None set.';
    if (channelCreate) channelCreate = check;
    else channelCreate = tick;
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

    const embed = new MessageEmbed()
      .addField('⚙ Channel Settings', `**Log Channel**: ${logChannel}\n**channelCreate**: ${channelCreate}\n**channelDelete**: ${channelDelete}`, true)
      .addField('💬 Message Settings', `**messageDelete**: ${messageDelete}\n**messageUpdate**: ${messageUpdate}\n**voiceStateUpdate**: ${voiceStateUpdate}\n**messageReactionAdd**: ${messageReactionAdd}`, true)
      .addField('🗒 Guild Settings', `**guildBanAdd**: ${guildBanAdd}\n**guidBanRemove**: ${guildBanRemove}\n**guildMemberAdd**: ${guildMemberAdd}\n**guildMemberUpdate**: ${guildMemberUpdate}\n**guildMemberRemove**: ${guildMemberRemove}`, true)
      .setFooter('w!<setting> <value> - Edit a setting, or run w!enable-all to turn all settings on, and w!disable-all to turn all settings off.');

    return message.channel.send(`${check} **Displaying module information for \`${message.guild.name}\`**.`, embed).then(msg => msg.delete({timeout:30000}));
  }
};