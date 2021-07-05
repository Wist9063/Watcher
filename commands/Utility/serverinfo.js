const Command = require('../../handlers/command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

function verfiCheck(verLvl) {
  if (verLvl == 'NONE') {return 'None';}
  else if (verLvl == 'LOW') {return 'Low';}
  else if (verLvl == 'MEDIUM') {return 'Medium';}
  else if (verLvl == 'HIGH') {return 'High';}
  else if (verLvl == 'VERY_HIGH') {return 'Maximum';}
}

function explictC(verLvl) {
  if (verLvl == 'DISABLED') {return 'Disabled';}
  else if (verLvl == 'MEMBERS_WITHOUT_ROLES') {return 'Scan Without Roles';}
  else if (verLvl == 'ALL_MEMBERS') {return 'Full Scan';}
}

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'serverinfo',
      aliases: ['si']
    });
  }

  async execute(message) {
    if (message.guild.available) {
      await message.guild.members.fetch();
      await message.guild.channels.fetch();

      const veri = verfiCheck(message.guild.verificationLevel);
      const ex = explictC(message.guild.explicitContentFilter);
      const owner = await message.guild.members.fetch(message.guild.ownerId);

      const embed = new MessageEmbed()
        .setColor('#7289DA')
        .setTitle(`Server information for __${message.guild.name}__`)
        .setDescription(`There are **${message.guild.members.cache.filter(m => !m.user.bot).size}** users and **${message.guild.members.cache.filter(m => m.user.bot).size}** bot${message.guild.members.cache.filter(m => m.user.bot).size == 1 ? '' : 's'}. In total, there are **${message.guild.members.cache.size}** members.\nServer Owned By: **${owner.user.username}#${owner.user.discriminator}** (ID: ${owner.user.id})`)
        .setFooter(`Guild ID: ${message.guild.id}`)
        .addField('❯❯ Verification Level', veri, true)
        .addField('❯❯ Explicit Content Fliter', ex, true)
        .addField('❯❯ Guild Created At', `\`${moment(message.guild.createdAt).format('MMMM Do YYYY, h:mm:ss A')}\``, false)
        .addField('❯❯ Text Channels', `${message.guild.channels.cache.filter(channel => channel.type === 'text').size}`, true)
        .addField('❯❯ Voice Channels', `${message.guild.channels.cache.filter(channel => channel.type === 'voice').size}`, true)
        .setThumbnail(message.guild.iconURL({'size': 2048, dynamic: true}) ? message.guild.iconURL({'size': 2048, dynamic: true}) : 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png');
      const embed2 = new MessageEmbed()
        .setColor('#7289DA')
        .addField(`❯❯ Roles (${message.guild.roles.cache.size})`, message.guild.roles.cache.map(role => role).sort((a, b) => b.position - a.position || b.id - a.id).join(' - '), false)
        .addField(`❯❯ Emojis (${message.guild.emojis.cache.size})`, message.guild.emojis.cache.map(role => role).sort().join(' '), false);

      await message.channel.send({embeds: [embed, embed2]});
      await message.guild.members.cache.clear();
      await message.guild.channels.cache.clear();
    } else {
      message.channel.send('__Could not fetch guild metadata.__ Discord may be experiencing an outage or API would not respond. Try again later.');
    }
  }
};