const config = require('../config.js');

class PermissionLevel {

  fetch(user, message) {
    if (config.owners.includes(user.id)) return [10, '<a:verifiedtech:742101827650322443> Owner - Official Bot Owner'];
    if (config.helpers.includes(user.id)) return [9, '<a:verifiedtech:742101827650322443> Development Team - Verified Bot Technician'];
    if (config.admins.includes(user.id)) return [8, '<a:verifiedtech:742101827650322443> Global Admin - Verified Bot Admin'];
    if (config.mods.includes(user.id)) return [7, '<a:verifiedtech:742101827650322443> Global Mod - Verified Bot Moderator'];
    if (user.id === message.guild.ownerID) return [4, 'Guild Owner'];
    if (message.guild.member(user).hasPermission('ADMINISTRATOR')) return [3, 'Guild Admin'];
    if (message.guild.member(user).hasPermission('MANAGE_GUILD')) return [2, 'Guild Mod'];
    return [0 , 'Guild Member'];
  }

}

module.exports = PermissionLevel;