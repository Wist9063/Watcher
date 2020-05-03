const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'ignore',
      aliases: ['ignorechannel', 'ignorechan', 'igadd']
    });
  }
  async execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`).then(msg => msg.delete({timeout:15000}));
    await db.get(message.guild.id, this.client.mongod, 'guildSettings').then((b) => {
      if (!b.wb.wbID) {
        message.channel.send(`${message.author} | You didn't setup a log channel yet! Run w!setup to setup one.`);
      } else {
        const array = b.ignoreChannel;
        const channel_value = message.mentions.channels.first();
        if (!channel_value) return message.channel.send(`**Command Usage**: \`w!ignore <channel-mention>\`\n(e.g. \`w!ignore #${message.channel.name}\`)`).then(msg => msg.delete({timeout:15000}));
        console.log(array);
        array.push(channel_value.id);

        this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {ignoreChannel: array}});
        return message.channel.send(`The following events have been disabled for the channel ${channel_value}.\n\n\`\`\`messageUpdate, messageDelete\`\`\`\nIf you'd like to disable this, you may run this command (\`w!ignore-delete ${channel_value}\`) to remove it from the ignored list. To see the current ignored channels, run the command \`w!ignore-list\`.`);
      }
    });
  }
};