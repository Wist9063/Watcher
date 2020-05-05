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
    if (message.perm < 2) return message.channel.send(`${message.author} | Insufficient permissions required to execute this command.`);
    if (!message.channel.permissionsFor(this.client.user.id).has('ADMINISTRATOR')) return message.author.send('In need the permission `ADMINISTRATOR` inorder to execute this command.');

    await db.get(message.guild.id, this.client.mongod, 'guildSettings').then((b) => {
  
      if (!b.wb.wbID) {
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('you did not specify a channel, please try again.');
        const setChannel = message.guild.channels.cache.get(channel.id);
        if (!setChannel) return message.reply('I couldn\'t locate that channel, please try again.');

        message.channel.send(`${message.author} | Logs will now be sent to ${channel}, testing my permissions.`).catch(error => {return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);});
        setChannel.createWebhook('Watcher', {
          avatar: 'https://raw.githubusercontent.com/Wist9063/Watcher/master/icon.png?token=AFIQ4NMQ4HO3JBT5BRXOQHK6WH7D6', 
          reason: `This is used to send watcher logs, do not delete or your logs will not send! Requested by ${message.author.tag}.`}).then(wb => {

          this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {wb: {
            wbID: wb.id,
            wbKey: wb.token,
            channelID: setChannel.id
          }}
          });

          const embed = new MessageEmbed()
            .setColor('#7289DA')
            .setTitle('Watcher is sending logs in this channel.')
            .setURL('https://discord.gg/83SAWkh')
            .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);

          wb.send(embed)
            .catch(error => {
              return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
            });

        });
      } else if (b.wb.wbID) {
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('you did not specify a channel, please try again.');
        const setChannel = message.guild.channels.cache.get(channel.id);
        if (!setChannel) return message.reply('I couldn\'t locate that channel, please try again.');

        const hook = new WebhookClient(b.wb.wbID, b.wb.wbKey);
        hook.delete(`Replacing hook for other log channel. Requested by ${message.author.tag}`);

        this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {wb: {
          wbID: null,
          wbKey: null
        }}
        });

        message.channel.send(`${message.author} | Logs will now be sent to ${channel}, testing my permissions.`).catch(error => {return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);});

        setChannel.createWebhook('Watcher', {
          avatar: 'https://raw.githubusercontent.com/Wist9063/Watcher/master/icon.png?token=AFIQ4NMQ4HO3JBT5BRXOQHK6WH7D6', 
          reason: `This is used to send watcher logs, do not delete or your logs will not send! Requested by ${message.author.tag}.`}).then(wb => {

          this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {wb: {
            wbID: wb.id,
            wbKey: wb.token,
            channelID: setChannel.id
          }}
          });

          const embed = new MessageEmbed()
            .setColor('#7289DA')
            .setTitle('Watcher is sending logs in this channel.')
            .setURL('https://discord.gg/83SAWkh')
            .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);

          wb.send(embed)
            .catch(error => {
              return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
            });

        });

      }
    }).catch(e => {return e;});
    
    return;
  }
};