const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore',
      disable: true,
      aliases: ['ignorechannel', 'ignorechan', 'igadd']
    });
  }
  async execute(message) {
    if (message.perm < 2) return message.reply({ content: 'Insufficient permissions required to execute this command.', allowedMentions: { repliedUser: true }});
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (!b.wb.wbID) {
      message.reply({ content: 'You didn\'t setup a log channel yet! Run w!setup to setup one.', allowedMentions: { repliedUser: true }});
    } else {
      const array = b.ignoreChannel;
      const channel_value = message.mentions.channels.first();
      if (!channel_value) return message.reply({ content: `Please enter a valid text channel.\n**Command Usage**: \`w!ignore <channel-mention>\`\n(e.g. \`w!ignore #${message.channel.name}\`)`, allowedMentions: { repliedUser: true }});
      array.push(channel_value.id);

      await db.update(message.guild.id, this.client.mongod, 'guildSettings', {ignoreChannel: array});
      return message.reply({ content: `The following events have been disabled for the channel ${channel_value}.\n\n\`\`\`messageUpdate, messageDelete\`\`\`\nIf you'd like to disable this, you may run this command (\`w!ignore-delete ${channel_value}\`) to remove it from the ignored list. To see the current ignored channels, run the command \`w!ignore-list\`.`, allowedMentions: { repliedUser: true }});
    }
  }
};