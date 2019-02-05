const Command = require('../../handlers/command.js');
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore-delete',
      aliases: ['ignoredel', 'ignoredelete', 'igdel']
    });
  }
  execute(message) {
    if (!db.has(`log-channel_${message.guild.id}`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {

      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
      const channel_value = message.mentions.channels.first();
      if (!channel_value) return message.channel.send(`**Command Usage**: \`w!ignore-delete <channel-mention>\`\n(e.g. \`w!ignore-delete #${message.channel.name}\`)`).then(msg => msg.delete({timeout:15000}));
      const fetched = db.get(`ignoreChannel_${message.guild.id}_${channel_value.id}`);
      if (fetched) {
        db.delete(`ignoreChannel_${message.guild.id}_${channel_value.id}`);
        return message.channel.send(`Removed ${channel_value} from the ignore list.`).then(msg => msg.delete({timeout:15000}));
      } else {
        return message.channel.send(`The channel ${channel_value} was never added to the ignore list.`).then(msg => msg.delete({timeout:15000}));
      }
    }
  }
};