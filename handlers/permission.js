const config = require('../config.js');

class PermissionLevel {

  fetch(client, message) {

    if (config.owners.includes(message.author.id)) return [10, '<:VerifiedBotTechnician:503405757719511063> **Owner** - **Official Bot Owner**'];
    if (config.helpers.includes(message.author.id)) return [9, '<:VerifiedBotTechnician:503405757719511063> **Development Team** - **Verified Bot Technician**'];
    if (config.admins.includes(message.author.id)) return [8, '<:VerifiedBotTechnician:503405757719511063> **Global Admin** - **Verified Bot Admin**'];
    if (config.mods.includes(message.author.id)) return [7, '<:VerifiedBotTechnician:503405757719511063> **Global Mod** - **Verified Bot Moderator**'];
    if (message.author.id === message.guild.ownerID) return [4, 'Guild Owner'];
    if (message.member.hasPermission('ADMINISTRATOR')) return [3, 'Guild Admin'];
    if (message.member.hasPermission('MANAGE_GUILD')) return [2, 'Guild Mod'];
    return [0 , 'Guild Member'];
  }

  fetchOther(client, message) {
    if (message.channel.type !== 'text') throw new Error('Invalid channel type.');
    if (message.mentions.members.size < 1) return 'err';
    if (!message.guild.members.get(message.mentions.users.first().id)) return 'err';

    if (config.owners.includes(message.mentions.users.first().id)) return [10, 'Owner/Developer'];
    if (config.helpers.includes(message.mentions.users.first().id)) return [9, 'Development Helper'];
    if (config.admins.includes(message.mentions.users.first().id)) return [8, 'Global Admin'];
    if (config.mods.includes(message.mentions.users.first().id)) return [7, 'Global Mod'];
    if (message.mentions.users.first().id === message.guild.owner.id) return [4, 'Guild Owner'];
    if (message.member.hasPermission('ADMINISTRATOR')) return [3, 'Guild Admin'];
    if (message.member.hasPermission('MANAGE_GUILD')) return [2, 'Guild Mod'];
    return [0 , 'Guild Member'];
  }
}

module.exports = PermissionLevel;
