const Command = require('../../handlers/command.js');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "ping",
            aliases: []
        });
    }

    execute(message) {
        const startTime = Date.now();
        message.channel.send(`Pinging...`).then(msg => {
            const endTime = Date.now();
            msg.edit(`Message: (${endTime - startTime}ms) | Heartbeat: (${Math.floor(this.client.ws.ping)}ms)`);
        })
        .catch(error => {
            return message.author.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
        });
    }
};
