const Command = require('../../handlers/command.js');
const discord = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug',
      aliases: []
    });
  }

  execute(message) {
    if (message.perm < 9) return;
    const embed = new discord.MessageEmbed()
      .setAuthor(this.client.user.tag)
      .setThumbnail(this.client.user.displayAvatarURL())
      .setDescription( 
        `**Discord.js**: ${discord.version}\n`
                + `**Node**: ${process.version}\n\n`
                + `**Guilds**: ${this.client.guilds.size}\n`
                + `**Channels**: ${this.client.channels.size}\n`
                + `**Users**: ${this.client.users.size}\n`
                + `**Uptime:** ${this.client.convertTime(this.client.uptime)}`);
    message.channel.send(embed);
  }
};
