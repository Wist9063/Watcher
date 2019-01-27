const db = require("quick.db");
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "guildbanadd",
            aliases: ["gbanadd"]
        });
    }

    execute(message) {
        if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
        if (!message.channel.permissionsFor(this.client.user.id).has("SEND_MESSAGES")) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
        let value = message.content.split(" ")[1];
        if (!value) return message.reply(`you did not specify a value, please include on or off.`).then(msg => msg.delete({timeout:10000}));
        if (value.toUpperCase() === "ON") return db.set(`guildBanAdd_${message.guild.id}`, { value: true }) && message.channel.send(`${message.author} | Logs will __now__ include \`guildBanAdd\`, database updated.`).then(msg => msg.delete({timeout:10000}));
        if (value.toUpperCase() === "OFF") return db.set(`guildBanAdd_${message.guild.id}`, { value: false }) && message.channel.send(`${message.author} | Logs will __not__ include \`guildBanAdd\`, database updated.`).then(msg => msg.delete({timeout:10000}));
        else return message.channel.send(`${message.author} | That is not a valid value, please try again.`)
    }
}