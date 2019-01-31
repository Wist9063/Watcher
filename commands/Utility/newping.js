const Command = require('../../handlers/command.js');

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "nping",
            aliases: []
        });
    }

    async execute(m) {
        let p;
        try {
          if (!this.client.getAllShardsAvailable()) throw new Error();
          p = await this.client.shard.broadcastEval("this.ping");
        } catch (e) {
          return m.channel.send(`There was an issue pinging all shards. This shard took ` +
            `${this.client.shard.ping.toFixed(0)} milliseconds to ping back.`);
        }
        const avg = p.reduce((a, b) => a + b, 0) / p.length;
        let str = "";
        for (let i = 0; i < this.client.shard.count; i++) {
          if (p[i]) {
            str += `Shard ${i}: ${p[i].toFixed(0)} milliseconds.\n`;
          } else {
            str += `Shard ${i}: Unavailable.\n`;
          }
        }
        str += `Average Ping: ${avg.toFixed(0)} milliseconds.`;
        return m.channel.send(str);
    }
};
