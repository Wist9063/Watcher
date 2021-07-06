const Command = require('../../handlers/InteractionCommand.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ping'
    });
  }

  async execute(interaction) {
    await interaction.reply(`:satellite_orbital: Heartbeat: **${Math.floor(this.client.ws.ping)}ms**`);
  }
};
