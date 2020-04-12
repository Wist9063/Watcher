const Command = require('../../handlers/command.js');
const config = require('../../config.js');

function clean(text) {
  text = text.toString();
  if (text.includes(config.token)) {
    text = text.replace(config.token, 'PLACEHOLDER FOR TOKEN.');
  }
  if (typeof(text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ev',
      aliases: ['eval']
    });
  }
  

  async execute(message) {
    if (message.perm < 9) return;
    const a = message.content.slice(message.content.search(' ') + 1);
    if (!a) return message.channel.send('You must provide some code to evaluate!');
  
    try {
      let res = eval(a);
      res = await res;
      if (typeof res !== 'string') res = require('util').inspect(res);
      console.log(`[Eval by ${message.author.tag}] Args: ${a}`); 
      await message.channel.send('```js\n' + '> ' + clean(res) + '\n```');
    } catch (e) {
      message.channel.send('```js\n' + '> ' + e + '\n```');
    }

  }
};