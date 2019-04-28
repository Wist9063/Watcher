const Command = require('../../handlers/command.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug',
      aliases: []
    });
  }

  execute(message) {
    if (message.perm < 9) return;
    const embed = new MessageEmbed()
      .setTitle('Database Debug Viewer 9000')
      .setDescription(`Currently accessing ${message.guild.name}'s database entry. Is enabled? ${db.get(`guild_${message.guild.id}.enabled`)}`)
      .setURL('https://discord.gg/83SAWkh')
      .addField('❯❯ Log Channel DB', `\`\`\`js\n${db.get(`guild_${message.guild.id}.logChannel`)}\n\`\`\``)
      .addField('❯❯ Events DB', `\`\`\`js\n${db.get(`guild_${message.guild.id}.events`)}\n\`\`\``);
    return message.channel.send(embed).catch(e => message.channel.send(`\`\`\`${e}\`\`\``));
  }
};
