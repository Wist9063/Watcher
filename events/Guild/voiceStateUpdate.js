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
      const logChannel = oldState.guild.channels.get(fetched);
      if (!logChannel) return;

      const voice1 = (oldState.channel ? oldState.channel.name : 'None');
      const voice2 = (newState.channel ? newState.channel.name : 'Left');

      if (voice1 == 'None') {
        const embed = new MessageEmbed().setColor('#7289DA').setTitle('Voice State Update').setURL('https://discord.gg/EH7jKFH').setDescription(`${oldState.member.user.tag} (ID:${oldState.member.user.id}) joined voice channel **${newState.member.voice.channel.name}**.`).setTimestamp();
        return logChannel.send(embed);
      } else if (voice2 == 'Left') {
        const embed = new MessageEmbed().setColor('#D92C2C').setTitle('Voice State Update').setURL('https://discord.gg/EH7jKFH').setDescription(`${oldState.member.user.tag} (ID:${oldState.member.user.id}) left voice channel **${voice1}**.`).setTimestamp();
        return logChannel.send(embed);
      } else if (voice1 != newState.channel.name) {
        const embed = new MessageEmbed().setColor('#D92C2C').setTitle('Voice State Update').setURL('https://discord.gg/EH7jKFH').setDescription(`${oldState.member.user.tag} (ID:${oldState.member.user.id}) moved from **${voice1}** -> **${newState.channel.name}**.`).setTimestamp();
        return logChannel.send(embed);
      }
    } else {
      return;
    }
  }
};