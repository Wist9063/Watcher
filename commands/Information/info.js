const Command = require("../../handlers/command.js");
const  Discord = require("discord.js");
const bytes = require("bytes");

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: "info",
      aliases: ["stats", "botinfo"]
    });
  }
  execute(message) {
    const embed = new Discord.MessageEmbed()
    .setColor("#7289DA")
    .setTitle(`${this.client.user.tag} | General Statistics`)
    .setDescription(`Quick overview, ${this.client.user.username} is in ${this.client.guilds.size.toLocaleString()} servers, has ${this.client.users.size.toLocaleString()} users globally, and obtains an uptime of ${this.client.convertTime(this.client.uptime)}`)
    .setURL("https://discord.gg/EH7jKFH")
    .addField("❯❯ General Information", `Servers - \`${this.client.guilds.size.toLocaleString()}\`\nUsers - \`${this.client.users.size.toLocaleString()}\`\nUptime - \`${this.client.convertTime(this.client.uptime)}\``, true)
    .addField("❯❯ Module Information", `Discord.js - \`${Discord.version}\`\nNode.js - \`${process.version}\``, true)
    .addField("❯❯ Additional Information", `Heap Usage - \`${bytes(process.memoryUsage().heapUsed)}\``)
    return message.channel.send(embed).catch(e => message.channel.send(`\`\`\`${e}\`\`\``));
  }
}