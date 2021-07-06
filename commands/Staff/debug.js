const Command = require('../../handlers/command.js');
const config = require('../../config.js');
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug',
      aliases: [],
      onlyOwner: true
    });
  }

  async execute(message) {
    const data = {
      name: 'ping',
      description: 'Replies with Watcher\'s ping!',
    };

    const command = this.client.guilds.cache.get('502895390807293963').commands.create(data);
    console.log(command);
    

  }
};
