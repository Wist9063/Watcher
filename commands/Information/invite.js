const { MessageEmbed } = require("discord.js");
const Command = require("../../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "invite",
            aliases: ["inv"]
        });
    }
    async execute(message) {
        let mssg = await message.channel.send(`✅ An invite has been sent in your DM's!`);
        message.author.send(`Thanks for having an interest for inviting Watcher to your server!\n**https://discordapp.com/oauth2/authorize?=&client_id=505571539333152781&scope=bot&permissions=8**`).catch(error => {
            message.channel.send(`I was unable to DM you, one moment while I report this.`).then(m => {
                setTimeout(() => {
                    mssg.delete();
                    m.edit(`Thanks for having an interest for inviting Watcher to your server!\n**https://discordapp.com/oauth2/authorize?=&client_id=505571539333152781&scope=bot&permissions=8**`)
                }, 5000);
            });
        });
        return;
    }
}