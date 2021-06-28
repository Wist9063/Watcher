const db = new (require('../../handlers/database.js'))();
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'enable-all',
      aliases: ['all-on']
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
          channelCreate: true,
          channelDelete: true,
          guildBanAdd: true,
          guildBanRemove: true,
          guildMemberAdd: true,
          guildMemberRemove: true,
          guildMemberUpdate: true,
          messageDelete: true,
          messageDeleteBulk: true,
          messageUpdate: true,
          voiceStateUpdate: true,
          messageReactionAdd: true,
          messageReactionRemove: true,
          roleCreate: true,
          roleDelete: true
        }
      });

      return message.reply({ content: 'Enabled **all** log events, database updated.', allowedMentions: { repliedUser: true }});
    }
  }
};