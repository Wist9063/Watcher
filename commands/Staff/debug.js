const Command = require('../../handlers/command.js');
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug',
      aliases: []
    });
  }

  execute(message) {
    if (message.perm < 9) return;
    db.get('502895390807293963', this.client.mongod, 'guildSettings').then((b) => {

      console.log(b);
    });
    

  }
};
