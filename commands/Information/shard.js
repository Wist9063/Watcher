const Command = require('../../handlers/command.js');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: 'shard',
            aliases: []
        });
    }

    execute(message) {
        message.channel.send(`${message.guild.name} is on shard ${this.client.shard.id}`)
    }
};