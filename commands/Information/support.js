const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'invite',
      aliases: ['inv']
    });
  }
  async execute(message) {
    const mssg = await message.channel.send('✅ Our hub invite has been sent in your DM\'s!');
    message.author.send('Thanks for joining our hub and inviting Watcher to your server!\n**discord.gg/83SAWkh**').catch(() => {
      message.channel.send('I was unable to DM you, sending in this channel.').then(m => {
        setTimeout(() => {
          mssg.delete();
          m.edit('Thanks for joining our hub and inviting Watcher to your server!\n**discord.gg/83SAWkh**');
        }, 5000);
      });
    });
    return;
  }
};