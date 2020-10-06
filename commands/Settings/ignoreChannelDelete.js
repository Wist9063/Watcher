const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore-delete',
      aliases: ['ignoredel', 'ignoredelete', 'igdel']
    });
  }
  async execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (!b.wb.wbID) {
      message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
    } else {
      const array = b.ignoreChannel;
      const channel_value = message.mentions.channels.first();
      if (!channel_value) return message.channel.send(`**Command Usage**: \`w!ignore-delete <channel-mention>\`\n(e.g. \`w!ignore-delete #${message.channel.name}\`)`);
      if (array.includes(channel_value.id)) {
        const index = array.indexOf(channel_value.id);
        if (index > -1) array.splice(index, 1);
        await db.update(message.guild.id, this.client.mongod, 'guildSettings', {ignoreChannel: array});
        return message.channel.send(`${channel_value} has been **removed** from the __ignore list__.`);
      } else {
        return message.channel.send(`The channel ${channel_value} was never added to the ignore list.`);
      }
    }
  }
};