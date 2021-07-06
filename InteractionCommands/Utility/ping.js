const Command = require('../../handlers/InteractionCommand.js');
const fetch = require('node-fetch');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ping'
    });
  }

  async execute(interaction) {
    fetch('https://srhpyqt94yxb.statuspage.io/api/v2/status.json')
      .then(res => res.json())
      .then(json => {
        interaction.reply(`:satellite_orbital: Heartbeat: **${Math.floor(this.client.ws.ping)}ms**\n:satellite: Discord Status: __${json.status.description}__`);
      });
  }
};
