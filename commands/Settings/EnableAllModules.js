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
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
    if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
    await db.set(`channelCreate_${message.guild.id}`, { value: true });
    await db.set(`channelDelete_${message.guild.id}`, { value: true });
    await db.set(`guildBanAdd_${message.guild.id}`, { value: true });
    await db.set(`guildBanRemove_${message.guild.id}`, { value: true });
    await db.set(`guildMemberAdd_${message.guild.id}`, { value: true });
    await db.set(`guildMemberRemove_${message.guild.id}`, { value: true });
    await db.set(`guildMemberUpdate_${message.guild.id}`, { value: true });
    await db.set(`messageDelete_${message.guild.id}`, { value: true });
    await db.set(`messageDeleteBulk_${message.guild.id}`, { value: true });
    await db.set(`messageUpdate_${message.guild.id}`, { value: true });       
    await db.set(`voiceStateUpdate_${message.guild.id}`, { value: true });
    await db.set(`messageReactionAdd_${message.guild.id}`, { value: true });
    return message.channel.send(`${message.author} | Enabled all log events \`all\`, database updated.`).then(msg => msg.delete({timeout:10000}));
  }
};