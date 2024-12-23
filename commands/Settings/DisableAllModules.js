const db = new (require('../../handlers/database.js'))();
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'disable-all',
      aliases: ['all-off']
    });
  }

  async execute(message) {
    if (message.perm < 2) return message.reply({ content: 'Insufficient permissions required to execute this command.', allowedMentions: { repliedUser: true }});
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (b.wb.wbID === null || b.wb.wbKey === null) {
      message.reply({ content: 'You didn\'t setup a log channel yet! Run w!setup to setup one.', allowedMentions: { repliedUser: true }});
    } else {
      await db.update(message.guild.id, this.client.mongod, 'events', {
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
          roleCreate: false,
          roleDelete: false 
        }
      });

      return message.reply({ content: 'Disabled **all** log events, database updated.', allowedMentions: { repliedUser: true }});
    }
  }
};