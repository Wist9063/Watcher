const Command = require('../../handlers/command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'serverinfo',
      aliases: ['si']
    });
  }

  execute(message) {
    if (message.guild.available) {

      let verfi;
      if (message.guild.verificationLevel == 0) {verfi = 'None';}
      else if (message.guild.verificationLevel == 1) {verfi = 'Low';}
      else if (message.guild.verificationLevel == 2) {verfi = 'Medium';}
      else if (message.guild.verificationLevel == 3) {verfi = 'High (Table-Flip)';}
      else if (message.guild.verificationLevel == 3) {verfi = 'Maximum (Double Table-Flip)';}
      let ex;
      if (message.guild.explicitContentFilter == 0) {ex = 'No Scan';}
      else if (message.guild.explicitContentFilter == 1) {ex = 'Scan Without Roles';}
      else if (message.guild.explicitContentFilter == 2) {ex = 'Full Scan';}

      const embed = new MessageEmbed()
        .setColor('#7289DA')
        .setTitle(`Server information for __${message.guild.name}__`)
        .setDescription(`This server has **${message.guild.memberCount}** members.\nServer Owned By: **${message.guild.owner.user.tag}** (ID: ${message.guild.owner.user.id})\n*Watcher Enabled?* ${db.get(`guild_${message.guild.id}.enabled`) ? 'True' : 'False'}`)
        .setURL('https://discord.gg/83SAWkh')
        .setFooter(`Guild ID: ${message.guild.id}`)
        .addField('❯❯ Verification Level', verfi, true)
        .addField('❯❯ Explicit Content Fliter', ex, true)
        .addField('❯❯ Region', message.guild.region, true)
        .setThumbnail(message.guild.iconURL({'format': 'png', 'size': 2048}) ? message.guild.iconURL({'format': 'png', 'size': 2048}) : 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png')
        .addField('❯❯ Guild Created At', `\`${moment(message.guild.createdAt).format('MMMM Do YYYY, h:mm:ss A')}\``, true);

      message.channel.send(embed);
    } else {
      message.channel.send('__Could not fetch guild metadata.__ Discord may be experiencing an outage or API would not respond. Try again later.');
    }
  }
};