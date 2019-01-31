const Command = require('../../handlers/command.js');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: 'serverinfo',
            aliases: ['si']
        });
    }

    execute(message) {

        const embed = new Discord.MessageEmbed()
        .setColor("#7289DA")
        .setTitle(`Serverinfo for "${message.guild.name}"`)
        .setDescription(`This server has `)
        .setURL("https://discord.gg/EH7jKFH")
        .addField("❯❯ General Information", `Servers - \`${this.client.guilds.size.toLocaleString()}\`\nUsers - \`${this.client.users.size.toLocaleString()}\`\nUptime - \`${this.client.convertTime(this.client.uptime)}\``, true)
        .addField("❯❯ Module Information", `\`\nNode.js - \`${process.version}\``, true)
        .addField("❯❯ Additional Information", `Heap Usage - \`${bytes(process.memoryUsage().heapUsed)}\``)

        message.channel.send(embed)
    }
};