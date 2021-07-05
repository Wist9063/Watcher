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
    if (!config.owners.includes(message.author.id)) return;
    await message.channel.send(null);//.catch((e) => {throw e;});
    /*
    db.get('502895390807293963', this.client.mongod, 'guildSettings').then((b) => {

      console.log(b);
    }); */
    

  }
};
