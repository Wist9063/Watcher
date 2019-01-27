const BotEvent = require("../../handlers/event.js");

module.exports = class extends BotEvent {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "message"
        });
    }

    async execute(message) {
        if (!message.guild || message.author.bot) return;
        const mentionRegex = new RegExp(`^<@!?${this.user.id}>`);
        if (mentionRegex.test(message.content)) {
            message.content = this.config.prefix + message.content.replace(mentionRegex, '');
            if (message.content.toLowerCase().includes("what") && message.content.toLowerCase().includes("prefix")) {
                message.content = this.config.prefix + "prefix";
            }
        }
        message.mentions.users = message.mentions.users.filter(u => u.id != this.user.id);
        if (!message.content.startsWith(this.config.prefix)) return;
        message.permArray = await new (require('../../handlers/permission.js'))().fetch(this, message);
        message.perm = message.permArray[0];
        const content = message.content.slice(this.config.prefix.length);
        const command = await this.fetchCommand(content.split(' ')[0]);
        if (!command) return;
        if (!message.channel.permissionsFor(message.guild.me).has(this.config.requiredPermissions)) return message.channel.send(`INVALID PERMISSIONS: Watcher requires the following permissions: \n${this.config.requiredPermissions.map(p => p)}`);
        console.log(`User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
        command.execute(message);
    }
};
