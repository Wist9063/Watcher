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
    if (message.perm < 3) return message.channel.send({ content: 'Insufficient permissions required to execute this command.'});
    const buttons = [
      [ 
        new Discord.MessageButton()
          .setCustomId('stepbystep')
          .setEmoji('🙋‍♂️')
          .setStyle('PRIMARY'),
      ],
      [ 
        new Discord.MessageButton()
          .setCustomId('guide')
          .setEmoji('📖')
          .setStyle('PRIMARY'),
      ]
    ];

    const replyButtons = [
      [ 
        new Discord.MessageButton()
          .setStyle('LINK')
          .setEmoji(this.client.emojis.cache.get('868767897835700255'))
          .setURL('https://www.patreon.com/watcherbot')
      ],
      [ 
        new Discord.MessageButton()
          .setStyle('LINK')
          .setEmoji(this.client.emojis.cache.get('868767898179629066'))
          .setURL('https://discord.gg/83SAWkh')
      ]
    ];
  
    const row = new Discord.MessageActionRow().addComponents(buttons);
    const m = await message.channel.send({ content: 'Would you like to run a __**step-by-step**__ setup (🙋‍♂️) or send a __**guide**__ (📖)?', components: [row] });

    const opt = await getOptions(message, m);
    if (opt === 'stepbystep') {
      const channelData = await stepByStep(message);
      const row1 = new Discord.MessageActionRow().addComponents(replyButtons);

      if (channelData === 'time') return message.channel.send('Time ran out when a channel. Please try again.');
      const channel = channelData.mentions.channels.first();
      if (!channel) return channelData.reply('This is not a valid channel. Please specify valid channel. Ex: `#logs` or `#audit-log`');
      const check = await checkExistWebhook(message, this.client.mongod);

      if (check) {
        const data = await db.get(message.guild.id, this.client.mongod, 'guildSettings');
        const hook = new Discord.WebhookClient(data.wb.wbID, data.wb.wbKey);
        
        await hook.delete(`Replacing hook for other log channel. Request made by ${message.author.tag}`);
        await createWebhook(message, channel, db, this.client.mongod);

        const embed = new Discord.MessageEmbed()
          .setTitle(`Replaced the set log channel to #${channel.name}.`)
          .setDescription(`**__To activate Watcher__, type \`w!enable-all\` into the chat to enable all events & start logging!**\nNeed support? Join our support server! *Click ${this.client.emojis.cache.get('868767898179629066')}*\n*Make sure that the bot has the __Administrator__ permission to ensure the bot is able to log **all** events that is happening in your server.*\n\nIf you want to __review/edit__ the settings of watcher type \`w!settings\` into the chat.\nTo change the log channel in the future, you can use the command \`w!log-channel\` to change the set logs or just run this command again.\n\nConsider donating to our patreon keep us afloat. *Click ${this.client.emojis.cache.get('868767897835700255')}*`)
          .setFooter(`Requested by ${message.author.tag}`)
          .setThumbnail('https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048')
          .setColor(0xcc8822);
        return channelData.reply({embeds: [embed], components: [row1]});
      } else {
        await createWebhook(message, channel, db, this.client.mongod);

        const embed = new Discord.MessageEmbed()
          .setTitle(`Set log channel to #${channel.name}.`)
          .setDescription(`**__To activate Watcher__, type \`w!enable-all\` into the chat to enable all events & start logging!**\nNeed support? Join our support server! *Click ${this.client.emojis.cache.get('868767898179629066')}*\n*Make sure that the bot has the __Administrator__ permission to ensure the bot is able to log **all** events that is happening in your server.*\n\nIf you want to __review/edit__ the settings of watcher type \`w!settings\` into the chat.\nTo change the log channel in the future, you can use the command \`w!log-channel\` to change the set logs or just run this command again.\n\nConsider donating to our patreon keep us afloat. *Click ${this.client.emojis.cache.get('868767897835700255')}*`)
          .setFooter(`Requested by ${message.author.tag}`)
          .setThumbnail('https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048')
          .setColor(0xcc8822);
        return channelData.reply({embeds: [embed], components: [row1]});
      }
    } 
    if (opt === 'guide') {
      const info_line = '**Thanks for inviting me! First and foremost, to setup the bot, you are required to invite it first. Once the bot is in your server, follow these steps below:**';
      const step_one = '`[1]` **Set a log channel.**\nSetting a log channel is simple and easy, simply run `w!log-channel #channel`. In addition, make sure that the bot has the __**Administrator**__ permission to ensure the bot is able to log events that is happening in your server.';
      const step_two = '`[2]` **Enable/Disable modules.**\nNow for the best part, logging modules. Run the command `w!modules`, and enable the modules you\'d like to log. __**Keep in mind that the whole command must be lowercase**__. (e.g `w!guildmemberjoin on`)';
      const step_three = '`[3]` **Finalizing.**\nFinalize the modules you\'d like to log, and you can now rest and know that your server has an advanced Discord logging bot! Moreover, if you\'d like to suggest a neat logging feature or you are having problems with Watcher, simply join our support server below.\n**<https://discord.gg/83SAWkh>**';
      const donate = '`[4]` **Donating.**\nIf you like the bot and want to keep it up and running, please consider donating to our patreon. *pls <3* **<https://www.patreon.com/watcherbot>**';
      return message.channel.send(`${info_line}\n\n${step_one}\n\n${step_two}\n\n${step_three}\n\n${donate}`);
    }
  }
};

// grabs the option that is selected
async function getOptions(message, m) {
  return new Promise(function(resolve, reject) {
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collect = m.createMessageComponentCollector({ filter, time: 15000, error: ['time'] });

    collect.on('collect', i => {
      if (i.customId === 'stepbystep') return i.update({ content: 'Now running a __**step-by-step**__ setup.', components: []}) && resolve('stepbystep');
      if (i.customId === 'guide') return i.update({ content: 'Sending a __**guide**__!', components: []}) && resolve('guide');
    });

    collect.on('end', collected => {
      if (collected.reason === 'time') return reject('time');
    });
  }).catch((e) => {console.log(e);});
}

// if stepByStep is selected this is ran
async function stepByStep(message) {
  await message.channel.send('Say a channel you want to send logs. Ex: `#logs` or `#audit-log`');
  return new Promise(function(resolve) {
    const filter = (msg) => {
      return msg.author.id === message.author.id && msg.mentions.channels;
    }; 
    const collect = message.channel.createMessageCollector({filter, max: 1, time: 10000});

    collect.on('end', (col) => {
      const cMention = col.first();
      if (!cMention) return resolve('time');
      else return resolve(cMention);
    });
  }).catch((e) => {console.log(e);});
}

// create webhook func, writes 2 database. then optional send message to logs
async function createWebhook(message, channel, db, mongo) {
  return new Promise(function(resolve) {
    channel.createWebhook('Watcher', {
      avatar: 'https://i.imgur.com/kGgTC0b.png', 
      reason: `This is used to send watcher logs, do not delete or your logs will not send! Request made by ${message.author.tag}.`
    }).then((webhook) => {
      db.update(message.guild.id, mongo, 'guildSettings', {wb: {
        wbID: webhook.id,
        wbKey: webhook.token,
        channelID: channel.id
      }});
      const embed = new Discord.MessageEmbed()
        .setColor('#7289DA')
        .setTitle('Watcher is sending logs in this channel.')
        .setThumbnail('https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048')
        .setDescription(`Watcher was told to send logs in this channel by ${message.author.tag}.`);
      webhook.send({embeds: [embed]});
  
      return resolve(webhook);
    });
  }).catch((e) => {console.log(e);});
}

// checks if there is an existing webhook
async function checkExistWebhook(message, mongo) {
  const data = await db.get(message.guild.id, mongo, 'guildSettings');
  return new Promise(function(resolve, reject) {
    if (data.wb.wbID) return resolve(true);
    else return reject(false);
  }).catch((e) => {console.log(e);});
}