const Command = require('../../handlers/command.js');
const config = require('../../config.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'rebuild',
      aliases: [],
      disabled: true,
      onlyOwner: true
    });
  }

  async execute(message) {
    if (!config.owners.includes(message.author.id)) return;
    message.channel.send('MySQL & quick.db not detected.');
    /*
    const g = this.client.guilds.cache.array();
    const f = this.client;
    const qdb = require('quick.db');
    g.forEach(function(item) {
      if (qdb.has(`guild_${item.id}.events`)) {
        f.mongod.db('watcher').collection('events').updateOne({gID: item.id}, {$set: {events: qdb.get(`guild_${item.id}.events`)}});
      }
    }); */
  }
};