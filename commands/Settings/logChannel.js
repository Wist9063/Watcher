const Command = require('../../handlers/command.js');
const db = new (require('../../handlers/database.js'))();
const { WebhookClient, MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'log-channel',
      aliases: ['logchan']
    });
  }

  async execute(message) {
    if (message.perm < 2) return message.reply({ content: 'Insufficient permissions required to execute this command.', allowedMentions: { repliedUser: true }});
    if (!message.channel.permissionsFor(this.client.user.id).has('ADMINISTRATOR')) return message.author.send('In need the permission `ADMINISTRATOR` inorder to execute this command.');

    const b = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
  
    if (!b.wb.wbID) {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('You did not specify a channel, please try again.');
      const setChannel = message.guild.channels.cache.get(channel.id);
      if (!setChannel) return message.reply('I couldn\'t locate that channel, please try again.');

      message.reply(`Logs will now be sent to ${channel}, testing my permissions.`).catch(error => {return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);});
      setChannel.createWebhook('Watcher', {
        avatar: 'https://i.imgur.com/kGgTC0b.png', 
        reason: `This is used to send watcher logs, do not delete or your logs will not send! Request made by ${message.author.tag}.`}).then(wb => {

        db.update(message.guild.id, this.client.mongod, 'guildSettings', {wb: {
          wbID: wb.id,
          wbKey: wb.token,
          channelID: setChannel.id
        }});

        const embed = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle('Watcher is sending logs in this channel.')
          .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.\nRemember to use \`w!enable-all\` to enable all events.`);

        wb.send({ embeds: [embed] })
          .catch(error => {
            return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
          });

      });
    } else if (b.wb.wbID) {
      const channel = message.mentions.channels.first();
      if (!channel) return message.reply('You did not specify a channel, please try again.');
      const setChannel = message.guild.channels.cache.get(channel.id);
      if (!setChannel) return message.reply('I couldn\'t locate that channel, please try again.');

      const hook = new WebhookClient(b.wb.wbID, b.wb.wbKey);
      hook.delete(`Replacing hook for other log channel. Request made by ${message.author.tag}`);

      db.update(message.guild.id, this.client.mongod, 'guildSettings', {wb: {
        wbID: null,
        wbKey: null,
        channelID: null
      }});

      message.reply(`The set log channel has been replaced with ${channel}. I will now be sending there, testing my permissions`).catch(error => {return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);});

      setChannel.createWebhook('Watcher', {
        avatar: 'https://i.imgur.com/kGgTC0b.png', 
        reason: `This is used to send watcher logs, do not delete or your logs will not send! Request made by ${message.author.tag}.`}).then(wb => {

        db.update(message.guild.id, this.client.mongod, 'guildSettings', {wb: {
          wbID: wb.id,
          wbKey: wb.token,
          channelID: setChannel.id
        }});

        const embed = new MessageEmbed()
          .setColor('#7289DA')
          .setTitle('Watcher is sending logs in this channel.')
          
          .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);

        wb.send({ embeds: [embed] })
          .catch(error => {
            return error;
          });

      });

    }
    
    return;
  }
};