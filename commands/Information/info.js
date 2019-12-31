const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const bytes = require('bytes');
const moment = require('moment');
require('moment-duration-format');
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'info',
      aliases: ['stats', 'botinfo']
    });
  }
  execute(message) {
    const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    const embed = new Discord.MessageEmbed()
      .setColor('#7289DA')
      .setTitle(`${this.client.user.tag} | General Statistics`)
      .setDescription(`Quick overview, ${this.client.user.username} is in ${this.client.guilds.size.toLocaleString()} servers, has ${this.client.users.size.toLocaleString()} users globally, and obtains an uptime of ${duration}.`)
      .setURL('https://discord.gg/83SAWkh')
      .addField('❯❯ General Information', `Servers - \`${this.client.guilds.size.toLocaleString()}\`\nUsers - \`${this.client.users.size.toLocaleString()}\`\nUptime - \`${duration}\`\nDatabase Entries - \`${db.all().length}\``, true)
      .addField('❯❯ Module Information', `Discord.js - \`${Discord.version}\`\nNode.js - \`${process.version}\`\nDatabase Version - \`${db.version}\``, true)
      .addField('❯❯ Additional Information', `\nMemory Usage - \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}\`MB\nHeap Usage - \`${bytes(process.memoryUsage().heapUsed)}\``);
    return message.channel.send(embed).catch(e => message.channel.send(`\`\`\`${e}\`\`\``));
  }
};