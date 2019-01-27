const BotEvent = require("../../handlers/event.js");
const log = require('umi-log');
const snekfetch = require("snekfetch");

module.exports = class extends BotEvent {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "ready"
        });
    }

    execute() {
     /* snekfetch.post(`https://discordbots.org/api/bots/335637950044045314/stats`)
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzNTYzNzk1MDA0NDA0NTMxNCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTEwNTQ2ODQ4fQ.vHlCEztno7r-btk-vETlrXOzjmYBrnuUfyaWO-gH6WQ')
        .send({ server_count: this.client.guilds.size})
        .then(log.notify('[Discord] Updated discordbots.org stats.'))
        .catch(e => log.info("[Discord] ", e.body));

    snekfetch.post(`https://bots.discord.pw/api/bots/335637950044045314/stats`)
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxMTI3MzI5NDY3NzQ5NjIxNzYiLCJyYW5kIjo0MjcsImlhdCI6MTQ4MjI2NTE0MX0.dHF39EeVOFgxi1SpxzNmAVNDewoZJffcoNBC3sFZ9Xk')
        .send({ server_count: scount})
        .then(log.info('[Discord] Updated bots.discord.pw stats.'))
        .catch(e => log.error("[Discord] ", e.body)); */

        console.log(log.info(`[Discord] Client Info: \nUser: ${this.user.tag}\nGuilds: ${this.guilds.size}\nChannels: ${this.channels.size}\nUsers: ${this.users.size}`));
        this.user.setPresence({ activity: { name: "w!help | V1.0.0", type: 0 } });
    }
};
