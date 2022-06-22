const BotEvent = require('../../handlers/event.js');
const db = new (require('../../handlers/database.js'))();
const sender = require('../../modules/WebhookSender.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'voiceStateUpdate'
    });
  }

  async execute(oldState, newState) {
    const b = await db.get(oldState.guild.id, this.mongod, 'guildSettings').catch((e) => {console.error(e);});
    const a = await db.get(oldState.guild.id, this.mongod, 'events').catch((e) => {console.error(e);});
    if (a.events.voiceStateUpdate === null) return;
    if (a.events.voiceStateUpdate === true) {
      if (b.wb.wbID === null || b.wb.wbKey === null) return;
      this.eventsend++;
      const voice1 = (oldState.channel ? oldState.channel.name : 'None');
      const voice2 = (newState.channel ? newState.channel.name : 'Left');
      const limitSec = 2000;

      if (voice1 == 'None') {
        const embed = new MessageEmbed()
          .setColor('#5cb85c')
          .setAuthor({name : `${newState.member.user.tag} has joined a voice channel.`, iconURL: newState.member.user.displayAvatarURL({dynamic: true})})
          .setDescription(`**${newState.member.user.tag}** ${newState.member.nickname ? '*(__' + newState.member.nickname + '__)* ' : ''}joined the voice channel **${voice2}** ${newState.channel.parent ? 'in the category' : '.'} ${newState.channel.parent ? '**' + newState.channel.parent.name + '**.' : ''}`)
          .setFooter({text: `Watcher Event • Voice State Update | User ID: ${newState.member.user.id}`})
          .setTimestamp();
        setTimeout( function() {
          return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
        }, limitSec);
      } else if (voice2 == 'Left') {
        const embed = new MessageEmbed()
          .setColor('#DD5449')
          .setAuthor({name : `${oldState.member.user.tag} has left a voice channel.`, iconURL: oldState.member.user.displayAvatarURL({dynamic: true})})
          .setDescription(`**${oldState.member.user.tag}** ${newState.member.nickname ? '*(__' + newState.member.nickname + '__)* ' : ''}left the voice channel **${voice1}** ${oldState.channel.parent ? 'in the category' : '.'} ${oldState.channel.parent ? '**' + oldState.channel.parent.name + '**.' : ''}`)
          .setFooter({text: `Watcher Event • Voice State Update | User ID: ${oldState.member.user.id}`})
          .setTimestamp();
        setTimeout( function() {
          return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON()});
        }, limitSec);
      } else if (voice1 != newState.channel.name) {
        // fuck this part of code bro
        let newPar = '.';
        if (newState.channel.parent && oldState.channel.parent === newState.channel.parent) {newPar = 'in the same category';} else if (newState.channel.parent) {newPar = `in the category **${newState.channel.parent.name}**`;}
        const embed = new MessageEmbed()
          .setColor('#5bc0de')
          .setDescription(`${oldState.member.user.tag} ${newState.member.nickname ? '*(__' + newState.member.nickname + '__)* ' : ''}has moved from **${voice1}** ${oldState.channel.parent ? 'in the category' : ''} ${oldState.channel.parent ? '**' + oldState.channel.parent.name + '**' : 'to'} ${oldState.channel.parent ? 'to' : ''} **${newState.channel.name}** ${newPar}`)
          .setAuthor({name : `${newState.member.user.tag} has moved to another voice channel.`, iconURL: newState.member.user.displayAvatarURL({dynamic: true})})
          .setFooter({text: `Watcher Event • Voice State Update | User ID: ${newState.member.user.id}`})
          .setTimestamp();
        setTimeout( function() {
          return sender({webhook: {id: b.wb.wbID, token: b.wb.wbKey}, embed: embed.toJSON(), guildId: oldState.guild.id});
        }, limitSec);
      } 
    }
  }
};