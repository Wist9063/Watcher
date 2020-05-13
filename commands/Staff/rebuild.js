const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'rebuild',
      aliases: []
    });
  }

  async execute(message) {
    if (message.perm < 9) return;
    const g = this.client.guilds.cache.array();
    const f = this.client;
    const qdb = require('quick.db');
    g.forEach(function(item) {
      if (qdb.has(`guild_${item.id}.events`)) {
        const events = qdb.get(`guild_${item.id}.events`);
        f.mongod.db('watcher').collection('events').updateOne({gID: item.id}, {$set: events});
      }
    });
  }
};