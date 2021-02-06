const config = require('../config.js');

class PermissionLevel {

  async fetch(user, message) {
    const member = await message.guild.members.fetch(user);
    if (config.owners.includes(user.id)) return [10, '<a:verifiedtech:742101827650322443> Owner'];
    else if (config.helpers.includes(user.id)) return [9, '<a:verifiedtech:742101827650322443> Development Team'];
    else if (config.admins.includes(user.id)) return [8, '<a:verifiedtech:742101827650322443> Global Admin'];
    else if (config.mods.includes(user.id)) return [7, '<a:verifiedtech:742101827650322443> Global Mod'];
    else if (user.id === message.guild.ownerID) return [4, 'Guild Owner'];
    else if (member.permissions.has('ADMINISTRATOR')) return [3, 'Guild Admin'];
    else if (member.permissions.has('MANAGE_GUILD')) return [2, 'Guild Mod'];
    else return [0 , 'Guild Member'];
  }

}

module.exports = PermissionLevel;