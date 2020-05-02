const db = require('quick.db');
const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'enable-all',
      aliases: ['all-on']
    });
  }

  async execute(message) {
    if (!db.has(`guild_${message.guild.id}.logChannel`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {

      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
      if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);

      await this.client.mongod.db('watcher').collection('events').updateOne({_id: message.guild.id}, {$set: {events: {
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
        roleCreate: true
      }}
      });

      /*
      await db.set(`guild_${message.guild.id}.events.channelCreate`, true);
      await db.set(`guild_${message.guild.id}.events.channelDelete`, true);
      await db.set(`guild_${message.guild.id}.events.guildBanAdd`, true);
      await db.set(`guild_${message.guild.id}.events.guildBanRemove`, true);
      await db.set(`guild_${message.guild.id}.events.guildMemberAdd`, true);
      await db.set(`guild_${message.guild.id}.events.guildMemberRemove`, true);
      await db.set(`guild_${message.guild.id}.events.guildMemberUpdate`, true);
      await db.set(`guild_${message.guild.id}.events.messageDelete`, true);
      await db.set(`guild_${message.guild.id}.events.messageDeleteBulk`, true);
      await db.set(`guild_${message.guild.id}.events.messageUpdate`, true);       
      await db.set(`guild_${message.guild.id}.events.voiceStateUpdate`, true);
      await db.set(`guild_${message.guild.id}.events.messageReactionAdd`, true);
      await db.set(`guild_${message.guild.id}.events.messageReactionRemove`, true);
      await db.set(`guild_${message.guild.id}.events.roleCreate`, true);
      */
      return message.channel.send(`${message.author} | Enabled **all** log events, database updated.`);
    }
  }
};