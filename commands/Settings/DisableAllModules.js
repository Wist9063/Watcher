const db = require('quick.db');
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'disable-all',
      aliases: ['all-off']
    });
  }

  async execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);

    if (!db.has(`guild_${message.guild.id}.logChannel`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {
      await db.set(`guild_${message.guild.id}.events.channelCreate`, false);
      await db.set(`guild_${message.guild.id}.events.channelDelete`, false);
      await db.set(`guild_${message.guild.id}.events.guildBanAdd`, false);
      await db.set(`guild_${message.guild.id}.events.guildBanRemove`, false);
      await db.set(`guild_${message.guild.id}.events.guildMemberAdd`, false);
      await db.set(`guild_${message.guild.id}.events.guildMemberRemove`, false);
      await db.set(`guild_${message.guild.id}.events.guildMemberUpdate`, false);
      await db.set(`guild_${message.guild.id}.events.messageDelete`, false);
      await db.set(`guild_${message.guild.id}.events.messageDeleteBulk`, false);
      await db.set(`guild_${message.guild.id}.events.messageUpdate`, false);       
      await db.set(`guild_${message.guild.id}.events.voiceStateUpdate`, false);
      await db.set(`guild_${message.guild.id}.events.messageReactionAdd`, false);
      await db.set(`guild_${message.guild.id}.events.messageReactionRemove`, false);
      await db.set(`guild_${message.guild.id}.events.roleCreate`, false);

      return message.channel.send(`${message.author} | Disabled **all** log events, database updated.`);
    }
  }
};