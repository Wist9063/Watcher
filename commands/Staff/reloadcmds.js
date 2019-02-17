const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'reload',
      aliases: ['rel']
    });
  }

  async execute(message) {
    if (message.perm < 9) return;
    await this.client.reloadCommands();
    return message.channel.send('<a:loading:503081230309392384>**Reloading...**')
      .then(msg => { 
        setTimeout(() => { 
          msg.edit('<:yes:501906738119835649>**Command module successfully reloaded.**'); 
        } ,1500);
      }
      );
  }
};