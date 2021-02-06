const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'privacy',
      aliases: []
    });
  }
  async execute(message) {
    message.channel.send('We care about your privacy. Here is how we use your data.\n<https://www.notion.so/Watcher-Privacy-Policy-270fc96623d84176beac89bc6a20dae4>');
  }
};