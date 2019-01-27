const BotEvent = require("../../handlers/event.js");
const db = require("quick.db");
const { MessageEmbed } = require("discord.js")

module.exports = class extends BotEvent {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "guildBanRemove"
        });
    }

    async execute(guild, user) {
    const fetched = await db.get(`log-channel_${guild.id}.channelid`);
    const fetch = await db.get(`guildBanRemove_${guild.id}.value`);
    if (fetch === null) return;
        if (fetch === true) {
            if (fetched === null) return;
            const logChannel = guild.channels.get(fetched);
            if (!logChannel) return;
                const embed = new MessageEmbed()
                .setColor("#D92C2C").setTitle("Member Unbanned").setURL("https://discord.gg/EH7jKFH").setDescription(`${user.tag} (ID:${user.id}) was unbanned.`).setFooter(`ID: ${user.id}`).setTimestamp()
                return logChannel.send(embed);
        } else {
            return;
        }
    }
};