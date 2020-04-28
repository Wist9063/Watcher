const Command = require('../../handlers/command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'log-channel',
      aliases: ['logchan']
    });
  }

  async execute(message) {
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`)
    if (!message.channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')) return message.author.send(`Please ensure that I have permissions to speak in ${message.channel}.`);
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('you did not specify a channel, please try again.')
    const setChannel = message.guild.channels.cache.get(channel.id);
    if (!setChannel) return message.reply('I couldn\'t locate that channel, please try again.');
    await this.client.mongod.db('watcher').collection('guildSettings').insertMany([{guildID: message.guild.id, enabled: true, logid: channel.id}]);

    message.channel.send(`${message.author} | Logs will now be sent to ${channel}, testing my permissions.`).catch(error => {
      return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);});
    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle('Watcher is sending logs in this channel.')
      .setURL('https://discord.gg/83SAWkh')
      .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);

    setChannel.send(embed)
      .catch(error => {
        return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
      });
    return;
  }
};