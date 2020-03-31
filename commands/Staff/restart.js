const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'restart',
      aliases: ['reboot']
    });
  }
  execute(message) {
    if (message.perm < 7) return;
    message.channel.send(`${this.client.emojis.cache.get('503081230309392384')}**Restarting...**`).then(msg => setTimeout(() => { msg.edit(`${this.client.emojis.get('506673019838660608')}**Client successfully restarted.**`);},1500));
    setTimeout(() => { process.exit();  }, 2500);
  }
};
