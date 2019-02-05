const Command = require('../../handlers/command.js');
const db = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore',
      aliases: ['ignorechannel', 'ignorechan', 'igadd']
    });
  }
  execute(message) {
    if (!db.has(`log-channel_${message.guild.id}`)) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {

      if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
      const channel_value = message.mentions.channels.first();
      if (!channel_value) return message.channel.send(`**Command Usage**: \`w!ignore <channel-mention>\`\n(e.g. \`w!ignore #${message.channel.name}\`)`).then(msg => msg.delete({timeout:15000}));
      db.set(`ignoreChannel_${message.guild.id}_${channel_value.id}`, { channelid: channel_value.id });
      return message.channel.send(`The following events have been disabled for the channel ${channel_value}.\n\n\`\`\`messageUpdate, messageDelete\`\`\`\nIf you'd like to disable this, you may run this command (\`w!ignore-delete ${channel_value}\`) to remove it from the ignored list. To see the current ignored channels, run the command \`w!ignore-list\`.`).then(msg => msg.delete({timeout:20000}));
    }
  }
};