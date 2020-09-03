const BotEvent = require('../../handlers/event.js');
const moment = require('moment-timezone');
const sentry = require('@sentry/node');
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

function randomString(length) {
  const pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890.-?/';
  let str = 0;
  for (let i = 0; i < length; i++) {
    str += pos.charAt(Math.floor(Math.random() * pos.length));
  }
  return str;
}

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'message'
    });
  }
  
  async execute(message) {
    if (!message.guild || message.author.bot) return;
    if (!message.content.startsWith(this.config.prefix)) return;
    const content = message.content.slice(this.config.prefix.length);
    const command = await this.fetchCommand(content.split(' ')[0]);
    if (!command) return;
    if (command.disabled == true) return message.channel.send('This command is globally disabled. Please try this command again at a later time or date.');
    if (!message.channel.permissionsFor(message.guild.me).has(this.config.requiredPermissions)) return message.channel.send(`INVALID PERMISSIONS: Watcher requires the following permissions: \n${this.config.requiredPermissions.map(p => p)}`);
    if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        return console.log(`[RATELIMITED!] [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] Action has been ratelimited. - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    message.mentions.users = message.mentions.users.filter(u => u.id != this.user.id);
    message.perm = await new (require('../../handlers/permission.js'))().fetch(message.author, message)[0];

    try { 
      if (!this.config.maintenance) {
        message.channel.startTyping();
        console.log(`[${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
        command.execute(message); 
        message.channel.stopTyping();
      } else if (this.config.maintenance) {
        message.channel.startTyping();
        console.log(`[${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
        command.execute(message); message.channel.stopTyping();
        if (content.split(' ')[1] != '--force') {
          await message.channel.send('Watcher is currently undergoing maintenance and will not be responding to any commands. Please check our hub for maintenance times. __**<https://discord.gg/83SAWkh>**__');
        } else if (content.split(' ')[1] === '--force' && message.perm > 9) {
          message.channel.startTyping();
          message.content = message.content.replace('--force', '');
          message.channel.send('This command has been forced to run while Watcher is in maintenance mode.');
          console.log(`[WARNING!] [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] Executed using --force. - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
          command.execute(message); message.channel.stopTyping();
        }
      } else {
        return message.channel.send('There has been an error in executing this command! Please the command later.'); 
      }
    } catch (e) {
      message.channel.stopTyping();
      const IDstring = randomString(5);
      console.log(e);

      sentry.withScope(function(scope) {
        scope.setUser({id: message.author.id, username: message.author.username});
        scope.setTag('errorID', IDstring);
        scope.setTag('cmd_Name', command.name);
        scope.setLevel('error');
        sentry.captureException(e); 
      });

      const embed = new Discord.MessageEmbed()
        .setTitle('⚠️ Watcher has encountered an error with this command.')
        .setDescription(`Watcher has encountered an error with this command & has logged this command. ID: **${IDstring}**\nError: \`${e}\``)
        .setTimestamp()
        .setColor('#FF0000');
      return await message.channel.send(embed);
    } 
  }
};
