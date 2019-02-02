const Command = require('../../handlers/command.js');
const MessageEmbed = require('discord.js').MessageEmbed;
const config = require('./config.js');
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ev',
      aliases: ['eval']
    });
    this.embed = function(input, output, error = false) {
      return new MessageEmbed().setColor(error ? 0xFF0000 : 0x00FF00).addField(':desktop: Input', input).addField(error ? ':error: Error' : 'Output', `\`\`\`${error ? '' : 'js'}\n${output}\n\`\`\``).setFooter(`${this.client.user.username} Eval`);
    };
  }

  async execute(message) {
    if (message.perm < 9) return;
    const a = message.content.join(' ');
    if (!a) {
      return message.channel.send('You must provide some code to evaluate!');
    }
  
    try {
      let res = eval(a);
      res = await res;
      if (typeof res !== 'string') res = require('util').inspect(res);
            
  
      await message.channel.send('```js\n' + '> ' + clean(res) + '\n```');
    } catch (e) {
      message.channel.send('```js\n' + '> ' + e + '\n```');
    }


  }};

function clean(text) {
  text = text.toString();
  if (text.includes(config.token)) {
    text = text.replace(config.token, 'reeeeeeeeeeeee don\'t try to take my token');
  }
  if (typeof(text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}
