const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const bytes = require('bytes');
const moment = require('moment');
require('moment-duration-format');
const pkg = require('../../package.json');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'info',
      cooldown: 6,
      aliases: ['stats', 'botinfo']
    });
  }
  execute(message) {
    const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    const embed = new Discord.MessageEmbed()
      .setColor('#428bca')
      .setTitle(`${this.client.user.tag} | General Statistics`)
      .setDescription(`Quick overview, ${this.client.user.username} is in ${this.client.guilds.cache.size} servers and obtains an uptime of ${duration}.`)
      
      .addField('❯❯ General Information', `Servers - \`${this.client.guilds.cache.size}\`\nUsers - \`${this.client.users.cache.size}\`\nUptime - \`${duration}\``, true)
      .addField('❯❯ Module Information', `Discord.js - \`${Discord.version}\`\nNode.js - \`${process.version}\`\nWatcher Version - \`${pkg.version}\``, true)
      .addField('❯❯ Additional Information', `\nMemory Usage - \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}\`MB\nHeap Usage - \`${bytes(process.memoryUsage().heapUsed)}\``)
      .setThumbnail('https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048');
    return message.channel.send({ embeds: [embed] }).catch(e => message.channel.send(`\`\`\`${e}\`\`\``));
  }
};