const db = require("quick.db");
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "log-channel",
            aliases: ["logchan"]
        });
    }

    execute(message) {
        if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
        if (!message.channel.permissionsFor(this.client.user.id).has("SEND_MESSAGES")) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
        let channel = message.mentions.channels.first();
        if (!channel) return message.reply(`you did not specify a channel, please try again.`).then(msg => msg.delete({timeout:10000}));
        let setChannel = message.guild.channels.get(channel.id);
        if (!setChannel) return message.reply(`I couldn't locate that channel, please try again.`).then(msg => msg.delete({timeout:10000}));;
        db.set(`log-channel_${message.guild.id}`, { channelid: channel.id });
        message.channel.send(`${message.author} | Logs will now be sent to ${channel}, testing my permissions.`).then(msg => msg.delete({timeout:10000})).catch(error => {
            return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``)});
        setChannel.send(`I was told to log here by **${message.author.tag}**. (DELETING IN 5 SECONDS)`)
        .then(msg => {
            msg.delete({timeout: 5000})
        })
        .catch(error => {
            return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
        })
        return;
    }
}