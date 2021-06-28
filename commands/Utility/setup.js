const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const db = new (require('../../handlers/database.js'))();

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'setup'
    });
  }
  async execute(message) {
    const m = await message.channel.send('Would you like to run a __**step-by-step**__ setup (🙋‍♂️) or send a __**guide**__ (📖)?\n*You have 20 seconds to react.*');
    const filter = (reaction, user) => {
      return reaction.emoji.name === '🙋‍♂️' || reaction.emoji.name === '📖' && user.id === message.author.id;
    };
    const filter1 = (m) => {
      return m.mentions && m.author.id === message.author.id;
    };

    // reactions 
    await m.react('🙋‍♂️');
    await setTimeout(() => { m.react('📖');},1000);

    await m.awaitReactions(filter, { maxEmojis: 1, time: 20000, errors: ['time'] })
      .then((c) => {
        if (c.first().emoji.name === '🙋‍♂️') {
          message.channel.send('Now running a __**step-by-step**__ setup.');
          setTimeout(() => { message.channel.send(`${message.author}, say a channel you want to send logs. Ex: \`#logs\` or \`#audit-log\``);},1500);
          message.channel.awaitMessages(filter1, { max: 1, time: 15000, errors: ['time'] })
            .then((c) => {
              const c1 = c.first().mentions.channels.first();
              
              db.get(message.guild.id, this.client.mongod, 'guildSettings').then((b) => {
                if (!b.wb.wbID) {
                  const embed = new Discord.MessageEmbed()
                    .setTitle(`You have set channel #${c1.name} to send logs to.`)
                    .setDescription('**__To activate Watcher__, type `w!enable-all` into the chat to enable all events & start logging!**\n\n*Make sure that the bot has the __Administrator__ permission to ensure the bot is able to log **all** events that is happening in your server.*\n\nIf you want to __review/edit__ the settings of watcher type `w!settings` into the chat.\nTo change the log channel in the future, you can use the command `w!log-channel` to change the set logs.\n\nConsider donating to our patreon keep us afloat. [https://www.patreon.com/watcherbot](https://www.patreon.com/watcherbot)')
                    .setFooter(`Requested by ${message.author.tag}`)
                    .setThumbnail('https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048')
                    .setColor(0xcc8822);
                  message.channel.send({embeds: [embed]});
                  
                  c1.createWebhook('Watcher', {
                    avatar: 'https://i.imgur.com/kGgTC0b.png', 
                    reason: `This is used to send watcher logs, do not delete or your logs will not send! Request made by ${message.author.tag}.`}).then(wb => {
                    this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {wb: {
                      wbID: wb.id,
                      wbKey: wb.token,
                      channelID: c1.id
                    }}});

                    const embed = new Discord.MessageEmbed()
                      .setColor('#7289DA')
                      .setTitle('Watcher is sending logs in this channel.')
                      
                      .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);
                    wb.send({embeds: [embed]}).catch(error => {
                      return message.channel.send(`There was an error executing this action:\n\`\`\`${error}\`\`\``);
                    });
                  });
                } else if (b.wb.wbID) {
                  const hook = new Discord.WebhookClient(b.wb.wbID, b.wb.wbKey);
                  hook.delete(`Replacing hook for other log channel. Request made by ${message.author.tag}`);
                  const embed = new Discord.MessageEmbed()
                    .setTitle(`You have replaced the previous log channel with #${c1.name}.`)
                    .setDescription('__To activate Watcher__, type `w!enable-all` into the chat to enable all events & start logging!\n*Make sure that the bot has the __Administrator__ permission to ensure the bot is able to log **all** events that is happening in your server.*\n\nIf you want to __review/edit__ the settings of watcher type `w!settings` into the chat.\nTo change the log channel in the future, you can use the command `w!log-channel` to change the set logs.\n\nConsider donating to our patreon keep us afloat. [https://www.patreon.com/watcherbot](https://www.patreon.com/watcherbot)')
                    .setFooter(`Requested by ${message.author.tag}`)
                    .setThumbnail('https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048')
                    .setColor(0xcc8822);
                  message.channel.send({embeds: [embed]});
                  this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {wb: {
                    wbID: null,
                    wbKey: null,
                    channelID: null
                  }}
                  });
                  c1.createWebhook('Watcher', {
                    avatar: 'https://i.imgur.com/kGgTC0b.png', 
                    reason: `This is used to send watcher logs, do not delete or your logs will not send! Request made by ${message.author.tag}.`}).then(wb => {
          
                    this.client.mongod.db('watcher').collection('guildSettings').updateOne({gID: message.guild.id}, {$set: {wb: {
                      wbID: wb.id,
                      wbKey: wb.token,
                      channelID: c1.id
                    }}
                    });
          
                    const embed = new Discord.MessageEmbed()
                      .setColor('#7289DA')
                      .setTitle('Watcher is sending logs in this channel.')
                      
                      .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);
          
                    wb.send({embeds: [embed]})
                      .catch(error => {
                        return error;
                      });
                  });
                }
              });
            }).catch(() => {
              message.channel.send('You haven\'t picked a channel. Rerun the command & try again.');
            });
        } else if (c.first().emoji.name === '📖') {
          const info_line = '**Thanks for inviting me! First and foremost, to setup the bot, you are required to invite it first. Once the bot is in your server, follow these steps below:**';
          const step_one = '`[1]` **Set a log channel.**\nSetting a log channel is simple and easy, simply run `w!log-channel #channel`. In addition, make sure that the bot has the __**Administrator**__ permission to ensure the bot is able to log events that is happening in your server.';
          const step_two = '`[2]` **Enable/Disable modules.**\nNow for the best part, logging modules. Run the command `w!modules`, and enable the modules you\'d like to log. __**Keep in mind that the whole command must be lowercase**__. (e.g `w!guildmemberjoin on`)';
          const step_three = '`[3]` **Finalizing.**\nFinalize the modules you\'d like to log, and you can now rest and know that your server has an advanced Discord logging bot! Moreover, if you\'d like to suggest a neat logging feature or you are having problems with Watcher, simply join our support server below.\n**<https://discord.gg/83SAWkh>**';
          const donate = '`[4]` **Donating.**\nIf you like the bot and want to keep it up and running, please consider donating to our patreon. *pls <3* **<https://www.patreon.com/watcherbot>**';
          return message.channel.send(`${info_line}\n\n${step_one}\n\n${step_two}\n\n${step_three}\n\n${donate}`);
        }
      }).catch(() => {
        message.channel.send('**You ran out of time to pick an emoji!** Rerun the command and pick an emoji.');
      });
  }
};