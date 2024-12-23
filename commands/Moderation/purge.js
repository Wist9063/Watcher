const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'purge',
      aliases: ['delete', 'clear', 'prune', 'del']
    });
  }

  async execute(message) {
    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
    if (b.wb.wbID === null || b.wb.wbKey === null) {
      message.reply({ content: 'You didn\'t setup a log channel yet! Run w!setup to setup one.', allowedMentions: { repliedUser: true }});
    } else {
      if (message.perm < 2) return message.channel.send(`${message.author}, you have insufficient permissions required to execute this command.`);
      //if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`${message.author} | I'm not capable of deleting messages, please ensure that I have the proper permissions to do so.`);
      const args = message.content.split(' ')[1];
      const logChannel = new WebhookClient({id: b.wb.wbID, token: b.wb.wbKey});
      if (!args) return message.reply({ content: 'Please specify an amount of messages to purge.', allowedMentions: { repliedUser: true }});
      if (!Number(args[0])) return message.reply({ content: 'The value you\'ve provided is not a valid number, please try again.', allowedMentions: { repliedUser: false }});
      if (args < 1) return message.reply({ content: 'Provide a number over 1, then try again.', allowedMentions: { repliedUser: false }});
      if (args > 100) return message.channel.send(`${message.author} | The value you've provided exceeds Discord's bulk delete message limit (100), please try again.`);
      message.channel.bulkDelete(args).then((m) => {
        message.channel.send(`${message.author} | I was able to purge a total of **${m.size}** messages.\n*Note: There may be a delay when purging messages.*`);

        const embed = new MessageEmbed()
          .setColor('#FF8686')
          .setAuthor(`${message.author.tag} has bulk deleted messages.`, message.author.displayAvatarURL())
          .setDescription(`**${args}** messages has been deleted.\nIn channel: ${message.channel}`)
          .setFooter(`Watcher Event • Bulk Delete | User ID: ${message.author.id}`)
          .setTimestamp();
        return logChannel.send({ embeds: [embed] });
      });

    }
  }
};