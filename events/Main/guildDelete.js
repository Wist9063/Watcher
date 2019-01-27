const BotEvent = require("../../handlers/event.js");
const { MessageEmbed } = require("discord.js")
const moment = require("moment");

module.exports = class extends BotEvent {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "guildDelete"
        });
    }

    async execute(guild) {
      const logChannel = this.channels.get("506299766955835392");
      if (!logChannel) return;
        const embed = new MessageEmbed()
        .setColor("#D92C2C").setTitle("Guild Delete").setURL("https://discord.gg/EH7jKFH").setDescription(`Removed from ${guild.name} (ID:${guild.id}), which is owned by ${guild.owner.user.tag} (ID:${guild.owner.user.id}), has ${guild.memberCount} members, and ${guild.members.filter(mem => mem.user.bot).size} bots.\n\n\`\`\`autohotkey\n${moment(guild.createdAt).format("MMMM Do, YYYY, h:mm:ss A")}\`\`\``).setFooter(`ID: ${guild.id}`)
        return logChannel.send(embed);
    }
};