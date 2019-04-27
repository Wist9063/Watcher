const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'reload',
      aliases: ['rel']
    });
  }

  async execute(message) {
    const a = message.content.slice(message.content.search(' ') + 1);
    if (message.perm < 9) return;
    if (!a) {
      return message.channel.send('You must provide a module to reload!');
    }
    if (a === 'cmds' || a === 'c') {
      await this.client.reloadCommands();
      return message.channel.send(`${this.client.emojis.get('503081230309392384')}**Reloading...**`)
        .then(msg => { 
          setTimeout(() => { 
            msg.edit(`${this.client.emojis.get('506673019838660608')}**Command modules successfully reloaded.**`); 
          } ,1500);
        });
    } else if (a === 'events' || a === 'e') {
      await this.client.reloadEvents();
      return message.channel.send(`${this.client.emojis.get('503081230309392384')}**Reloading...**`)
        .then(msg => { 
          setTimeout(() => { 
            msg.edit(`${this.client.emojis.get('506673019838660608')}**Event modules successfully reloaded.**`); 
          } ,1500);
        });
    } else {
      return message.channel.send('Undef reload trigger.');
    }
  }
};