const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore-delete',
      disabled : true,
      aliases: ['ignoredel', 'ignoredelete', 'igdel']
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
      if (!channel_value) return message.reply({ content: `**Command Usage**: \`w!ignore-delete <channel-mention>\`\n(e.g. \`w!ignore-delete #${message.channel.name}\`)`, allowedMentions: { repliedUser: true }});
      if (array.includes(channel_value.id)) {
        const index = array.indexOf(channel_value.id);
        if (index > -1) array.splice(index, 1);
        await db.update(message.guild.id, this.client.mongod, 'guildSettings', {ignoreChannel: array});
        return message.reply({ content: `${channel_value} has been **removed** from the __ignore list__.`, allowedMentions: { repliedUser: true }});
      } else {
        return message.reply({ content: `The channel ${channel_value} was never added to the ignore list.`, allowedMentions: { repliedUser: true }});
      }
    }
  }
};