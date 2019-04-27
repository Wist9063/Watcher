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
    let a = JSON.stringify(db.get(`guild_${message.guild.id}`));
    a = JSON.parse(a);
    message.channel.send(`\`\`\`js\n${a}\n\`\`\``);
  }
};
