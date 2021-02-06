const Command = require('../../handlers/command.js');
const fetch = require('node-fetch');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ping',
      cooldown: 10,
      aliases: []
    });
  }

  async execute(message) {
    const m = await message.channel.send('Testing ping...');
    fetch('https://srhpyqt94yxb.statuspage.io/api/v2/status.json')
      .then(res => res.json())
      .then(json => {
        m.edit(`:satellite_orbital: Heartbeat: **${Math.floor(this.client.ws.ping)}ms** - Message Took **${m.createdTimestamp - message.createdTimestamp}ms** to edit\n:satellite: Discord Status: __${json.status.description}__`);
      });
  }
};
