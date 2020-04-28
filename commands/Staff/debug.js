const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();


module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug',
      aliases: []
    });
  }

  async execute(message) {
    if (message.perm < 9) return;
    await db.get('502895390807293963', this.client.mongod, 'guildSettings').then((b) => {

      console.log(b.logid);
    });
    

  }
};
