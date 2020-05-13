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
    g.forEach(function(item) {
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
    });
  }
};