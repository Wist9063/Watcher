const Command = require('../../handlers/command.js');
const exec = require('child_process').exec;

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'pull',
      aliases: []
    });
  }

  execute(message) {
    if (message.perm < 9) return;
    message.channel.send(`${this.client.emojis.get('503081230309392384')}**Pulling From Github...**`).then(msg => setTimeout(() => { msg.edit(`${this.client.emojis.get('506673019838660608')}**Client successfully restarted.**`);},1500));
    setTimeout(() => { exec('git pull').then(a => message.channel.send(`\`\`\`js\n${a}\n\`\`\``)); }, 2500);
  }
};