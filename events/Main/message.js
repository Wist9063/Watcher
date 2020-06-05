const BotEvent = require('../../handlers/event.js');
const moment = require('moment-timezone');
const sentry = require('@sentry/node');
const MessageEmbed = require('discord.js').MessageEmbed;

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
    /*
    const mentionRegex = new RegExp(`^<@!?${this.user.id}>`);
    if (mentionRegex.test(message.content)) {
      message.content = this.config.prefix + message.content.replace(mentionRegex, '');
      if (message.content.toLowerCase().includes('what') && message.content.toLowerCase().includes('prefix')) {
        message.content = this.config.prefix + 'prefix';
      }
    } */
    message.mentions.users = message.mentions.users.filter(u => u.id != this.user.id);
    if (!message.content.startsWith(this.config.prefix)) return;
    message.perm = await new (require('../../handlers/permission.js'))().fetch(message.author, message)[0];
    const content = message.content.slice(this.config.prefix.length);
    const command = await this.fetchCommand(content.split(' ')[0]);
    if (!command) return;
    if (!message.channel.permissionsFor(message.guild.me).has(this.config.requiredPermissions)) return message.channel.send(`INVALID PERMISSIONS: Watcher requires the following permissions: \n${this.config.requiredPermissions.map(p => p)}`);

    try { 
      if (this.config.maintenance) {
        if (content.split(' ')[1] != '--force') {
          await message.channel.send('Watcher is currently undergoing maintenance and will not be responding to any commands. Please check our hub for maintenance times. __**<https://discord.gg/83SAWkh>**__');
        } else if (content.split(' ')[1] === '--force' && message.perm > 9) {
          message.channel.startTyping();
          message.content = message.content.replace('--force', '');
          console.log(message.content);
          message.channel.send('This command has been forced to run while Watcher is in maintenance mode.');
          console.log(`[WARNING!] [${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] Executed using --force. - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
          await command.execute(message); message.channel.stopTyping();
        }
      } else if (!this.config.maintenance) {
        message.channel.startTyping();
        console.log(`[${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
        await command.execute(message); message.channel.stopTyping();
      } else {
        return message.channel.send('There has been an error in executing this command! Please the command later.'); 
      }
    } catch (e) {
      message.channel.stopTyping();
      const IDstring = randomString(5);
      console.log('[Error] An error has been detected in a command. Check sentry. ID: ' + IDstring);

      sentry.withScope(function(scope) {
        scope.setUser({id: message.author.id, username: message.author.username});
        scope.setTag('errorID', IDstring);
        scope.setLevel('error');
        sentry.captureException(e); 
      });

      const embed = new MessageEmbed()
        .setTitle('⚠️ Watcher has encountered an error with this command.')
        .setDescription(`Watcher has encountered an error with this command! Please report this error with the following ID in our hub. ID: **${IDstring}**`)
        .setTimestamp()
        .setColor('#FF0000');
      
      return await message.channel.send(embed);
    } 
  }
};
