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

  execute(message) {
    if (!config.owners.includes(message.author.id)) return;
    message.channel.send('Debug not available on production.');
    /*
    db.get('502895390807293963', this.client.mongod, 'guildSettings').then((b) => {

      console.log(b);
    }); */
    

  }
};
