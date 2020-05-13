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
    const qdb = require('quick.db');
    const f = this.client;
    g.forEach(function(item) {
      if (qdb.get(`guild_${item.id}.enabled`)) {
        f.mongod.db('watcher').collection('events').insertMany([{ 
          gID: item.id, 
          events: {
            channelCreate: false,
            channelDelete: false,
            guildBanAdd: false,
            guildBanRemove: false,
            guildMemberAdd: false,
            guildMemberRemove: false,
            guildMemberUpdate: false,
            messageDelete: false,
            messageDeleteBulk: false,
            messageUpdate: false,
            voiceStateUpdate: false,
            messageReactionAdd: false,
            messageReactionRemove: false,
            roleCreate: false
          }
        }]);
        f.mongod.db('watcher').collection('guildSettings').insertMany([{gID: item.id, wb: { wbID: null, wbKey: null }, ignoreChannel: []}]);
      }
    });
  }
};