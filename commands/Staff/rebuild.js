const Command = require('../../handlers/command.js');
const qdb = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'rebuild',
      aliases: []
    });
  }

  execute(message) {
    if (message.perm < 9) return;
    const array = [];
    qdb.all().forEach(function(item) {
      if (item.events) {
        array.push(item.events);
      }
    });
    console.log(array);
  }
};