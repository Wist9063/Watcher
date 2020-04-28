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
    let que = db.get(`guild_${message.guild.id}`);
    que = JSON.parse(JSON.stringify(que));
    const embed = new MessageEmbed()
      .setTitle('Database Debug Viewer 9000')
      .setDescription(`Currently accessing ${message.guild.name}'s database entry. Is enabled? \`${que.enabled}\``)
      .setURL('https://discord.gg/83SAWkh')
      .addField('❯❯ Log Channel DB', `\`\`\`js\n${que.logChannel}\n\`\`\``)
      .addField('❯❯ Events DB', `\`\`\`js\n${que.events}\n\`\`\``);
    return message.channel.send(embed).catch(e => message.channel.send(`\`\`\`${e}\`\`\``));
  }
};
