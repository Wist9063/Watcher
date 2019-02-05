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

    if (!db.has(`log-channel_${message.guild.id}`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {
      await db.set(`channelCreate_${message.guild.id}`, { value: false });
      await db.set(`channelDelete_${message.guild.id}`, { value: false });
      await db.set(`guildBanAdd_${message.guild.id}`, { value: false });
      await db.set(`guildBanRemove_${message.guild.id}`, { value: false });
      await db.set(`guildMemberAdd_${message.guild.id}`, { value: false });
      await db.set(`guildMemberRemove_${message.guild.id}`, { value: false });
      await db.set(`guildMemberUpdate_${message.guild.id}`, { value: false });
      await db.set(`messageDelete_${message.guild.id}`, { value: false });
      await db.set(`messageDeleteBulk_${message.guild.id}`, { value: false });
      await db.set(`messageUpdate_${message.guild.id}`, { value: false });       
      await db.set(`voiceStateUpdate_${message.guild.id}`, { value: false });
      await db.set(`messageReactionAdd_${message.guild.id}`, { value: false });
      await db.set(`messageReactionRemove_${message.guild.id}`, { value: true });
      return message.channel.send(`${message.author} | Disabled all log events \`all\`, database updated.`);
    }
  }
};