const config = require('../config.js');

class PermissionLevel {

  fetch(message) {
    if (config.owners.includes(message.author.id)) return [10, '<a:verifiedtech:742101827650322443> Owner']
    else if (config.helpers.includes(message.author.id)) return [9, '<a:verifiedtech:742101827650322443> Development Team']
    else if (config.admins.includes(message.author.id)) return [8, '<a:verifiedtech:742101827650322443> Global Admin']
    else if (config.mods.includes(message.author.id)) return [7, '<a:verifiedtech:742101827650322443> Global Mod']
    else if (message.author.id === message.guild.ownerID) return [4, 'Guild Owner']
    else if (message.member.hasPermission('ADMINISTRATOR')) return [3, 'Guild Admin']
    else if (message.member.hasPermission('MANAGE_GUILD')) return [2, 'Guild Mod']
    return [0 , 'Guild Member']
  }

}

module.exports = PermissionLevel;