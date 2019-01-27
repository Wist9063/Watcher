const { MessageEmbed } = require("discord.js");
const Command = require("../../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "help",
            aliases: ["cmds", "commands"]
        });
    }
    execute(message) {
        const embed = new MessageEmbed()
        .setColor("#7289DA")
        .setTitle("Watcher | The Advanced Logging Bot")
        .setDescription(`**Prefix**: \`w!\`\n\nWatcher provides your server with feature-rich advanced customizable logging features, to enhance your user experience.\n\nEvents we currently support:\n\`\`\`channelCreate, channelDelete, guildBanAdd, guildBanRemove, guildMemberAdd, guildMemberRemove, guildMemberUpdate, messageDelete, messageUpdate, voiceStateUpdate\`\`\``)
        .setURL("https://discord.gg/EH7jKFH")
        .setImage("https://i.imgur.com/mmqiujm.png")
        .setThumbnail(this.client.user.displayAvatarURL())
        .addField("Information [4]", `\`settings\`, \`help\`, \`setup\`, \`invite\``)
        .addField("Utility [3]", `\`perm\`, \`ping\`, \`purge\``)
        .addField("Settings [14]", `\`channelcreate\`, \`channeldelete\`, \`all-off\`, \`all-on\`, \`guildbanadd\`, \`guildbanremove\`, \`guildmemberadd\`, \`guildmemberremove\`, \`guildmemberupdate\`, \`log-channel\`, \`messagedelete\`, \`messagebulkdelete\`, \`messageupdate\`, \`voicestateupdate\``)
        .addField("Support Server", "[https://discord.gg/EH7jKFH](https://discord.gg/EH7jKFH)")
        .addField("Setup Guide", "Run the command `w!setup`.")
        .setFooter(`Programmed by jason.#0001, with the Discord.js library.`)
        return message.channel.send(embed);
    }
}