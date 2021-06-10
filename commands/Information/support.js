const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'support',
      aliases: []
    });
  }
  async execute(message) {
    const mssg = await message.channel.send('✅ Our hub invite has been sent in your DM\'s!');
    message.author.send('Thanks for joining our hub and inviting Watcher to your server!\n**discord.gg/YyGaApfrTc**').catch(() => {
      message.channel.send('I was unable to DM you, sending in this channel.').then(m => {
        setTimeout(() => {
          mssg.delete();
          m.edit('Thanks for joining our hub and inviting Watcher to your server!\n**discord.gg/YyGaApfrTc**');
        }, 5000);
      });
    });
    return;
  }
};