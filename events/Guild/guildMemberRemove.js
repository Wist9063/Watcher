const BotEvent = require("../../handlers/event.js");
const db = require("quick.db");
const { MessageEmbed } = require("discord.js")

module.exports = class extends BotEvent {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "guildMemberRemove"
        });
    }

    async execute(member) {
    const guild = member.guild;
    const fetched = await db.get(`log-channel_${guild.id}.channelid`);
    const fetch = await db.get(`guildMemberRemove_${guild.id}.value`);
    if (fetch === null) return;
        if (fetch === true) {
            if (fetched === null) return;
            const logChannel = guild.channels.get(fetched);
            if (!logChannel) return;
            const embed = new MessageEmbed()
            .setColor("#D92C2C").setTitle("Member Left").setURL("https://discord.gg/EH7jKFH").setDescription(`${member.user.tag} (ID:${member.user.id}) has left. **${guild.name}** now has ${guild.memberCount} members.`).setFooter(`ID: ${member.user.id}`).setTimestamp()
            return logChannel.send(embed);
        } else {
            return;
        }
    }
};