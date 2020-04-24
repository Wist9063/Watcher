const BotEvent = require('../../handlers/event.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'voiceStateUpdate'
    });
  }

  async execute(oldState, newState) {
    const fetched = await db.get(`guild_${oldState.guild.id}.logChannel.id`);
    const fetch = await db.get(`guild_${oldState.guild.id}.events.voiceStateUpdate`);
    if (fetch === null) return;
    if (fetch === true) {
      if (fetched === null) return;
      const logChannel = oldState.guild.channels.cache.get(fetched);
      if (!logChannel) return;

      const voice1 = (oldState.channel ? oldState.channel.name : 'None');
      const voice2 = (newState.channel ? newState.channel.name : 'Left');

      if (voice1 == 'None') {
        const embed = new MessageEmbed()
          .setColor('#32CD32')
          .setAuthor(`${newState.member.user.tag} has joined a voice channel.`, newState.member.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
          .setDescription(`**${newState.member.user.tag}** joined voice channel **${voice2}** ${newState.channel.parent ? 'in the category' : '.'} ${newState.channel.parent ? '**' + newState.channel.parent.name + '**.' : ''}`)
          .setFooter(`${newState.member.user.tag}'s ID is ${newState.member.user.id} • Voice State Update event.`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (voice2 == 'Left') {
        const embed = new MessageEmbed()
          .setColor('#D92C2C')
          .setAuthor(`${newState.member.user.tag} has left a voice channel.`, newState.member.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
          .setDescription(`**${oldState.member.user.tag}** left voice channel **${voice1}** ${oldState.channel.parent ? 'in the category' : '.'} ${oldState.channel.parent ? '**' + oldState.channel.parent.name + '**.' : ''}`)
          .setFooter(`${newState.member.user.tag}'s ID is ${newState.member.user.id} • Voice State Update event.`)
          .setTimestamp();
        return logChannel.send(embed);
      } else if (voice1 != newState.channel.name) {
        // fuck this part of code bro
        let newPar = '.';
        if (newState.channel.parent && oldState.channel.parent === newState.channel.parent) {newPar = 'in the same category';} else if (newState.channel.parent) {newPar = `in the category **${newState.channel.parent.name}**`;}
        const embed = new MessageEmbed()
          .setColor('#006400')
          .setDescription(`${oldState.member.user.tag} has moved from **${voice1}** ${oldState.channel.parent ? 'in the category' : ''} ${oldState.channel.parent ? '**' + oldState.channel.parent.name + '**' : 'to'} ${oldState.channel.parent ? 'to' : ''} **${newState.channel.name}** ${newPar}`)
          .setAuthor(`${newState.member.user.tag} has moved to another voice channel.`, newState.member.user.displayAvatarURL(), 'https://discord.gg/83SAWkh')
          .setFooter(`${newState.member.user.tag}'s ID is ${newState.member.user.id} • Voice State Update event.`)
          .setTimestamp();
        return logChannel.send(embed);
      }
    } else {
      return;
    }
  }
};