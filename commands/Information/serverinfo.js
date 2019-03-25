const Command = require('../../handlers/command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'serverinfo',
      aliases: ['si']
    });
  }

  execute(message) {

    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle(`Server Info for guild: ${message.guild.name}`)
      .setDescription('This server has ')
      .setURL('https://discord.gg/83SAWkh')
      .addField('❯❯ General Information', `Servers - \`${this.client.guilds.size.toLocaleString()}\`\nUsers - \`${this.client.users.size.toLocaleString()}\`\n`, true)
      .addField('❯❯ Module Information', `\`\nNode.js - \`${process.version}\``, true);

    message.channel.send(embed);
  }
};