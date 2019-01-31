const Command = require('../../handlers/command.js');
const util = require('util');
const MessageEmbed = require('discord.js').MessageEmbed;
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ev',
    });
    this.embed = function(input, output, error = false) {
      return new MessageEmbed().setColor(error ? 0xFF0000 : 0x00FF00).addField(':desktop: Input', input).addField(error ? ':error: Error' : 'Output', `\`\`\`${error ? '' : 'js'}\n${output}\n\`\`\``).setFooter(`${this.client.user.username} Eval`);
    };
  }

  execute(message) {
    if (message.perm < 9) return;
    const code = message.content.slice(message.content.search(' ') + 1);
    if (!code.length) return message.channel.send('No code input.');
    if (code.match(/token/gi)) return message.channel.send('The input requests the user token.');
    try {
      return message.channel.send(`\`\`\`js\n${eval(code)}\n\`\`\``);
    } catch (err) {
      return message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
    }
  }};
