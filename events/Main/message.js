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
    /*var start = process.hrtime();
    var elapsed_time = function(note) {
      var precision = 3; // 3 decimal places
      var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
      console.log(process.hrtime(start)[0] + ' s, ' + elapsed.toFixed(precision) + ' ms - ' + note); // print message + time
      start = process.hrtime(); // reset the timer
    }; */

    if (!message.guild || message.author.bot) return;
    const mentionRegex = new RegExp(`^<@!?${this.user.id}>`);
    if (mentionRegex.test(message.content)) {
      message.content = this.config.prefix + message.content.replace(mentionRegex, '');
      if (message.content.toLowerCase().includes('what') && message.content.toLowerCase().includes('prefix')) {
        message.content = this.config.prefix + 'prefix';
      }
    }
    message.mentions.users = message.mentions.users.filter(u => u.id != this.user.id);
    if (!message.content.startsWith(this.config.prefix)) return;
    message.permArray = await new (require('../../handlers/permission.js'))().fetch(message.author, message);
    message.perm = await message.permArray[0];
    const content = message.content.slice(this.config.prefix.length);
    const command = await this.fetchCommand(content.split(' ')[0]);
    if (!command) return;
    if (!message.channel.permissionsFor(message.guild.me).has(this.config.requiredPermissions)) return message.channel.send(`INVALID PERMISSIONS: Watcher requires the following permissions: \n${this.config.requiredPermissions.map(p => p)}`);
    console.log(`[${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);

    try { 
      message.channel.startTyping();
      if (this.config.maintenance) {
        if (content.split(' ')[1] != '--force') {
          await message.channel.send('Watcher is currently undergoing maintenance and will not be responding to any commands. Please check our hub for maintenance times. __**<https://discord.gg/83SAWkh>**__');
        } else if (content.split(' ')[1] === '--force') {
          message.channel.send('This command has been forced to run while Watcher is in maintenance mode.');
          await command.execute(message);
        }
      } else if (!this.config.maintenance) {
        await command.execute(message);
      }
      message.channel.stopTyping();
    } catch (e) {
      message.channel.stopTyping();
      const IDstring = randomString(5);
      console.log('[Error] An error has been detected in a command. Check sentry. ID: ' + IDstring);

      sentry.withScope(function(scope) {
        scope.setUser({id: message.author.id, username: message.author.username});
        scope.setTag('errorID', IDstring);
        scope.setLevel('error');
        // will be tagged with my-tag="my value"
        sentry.captureException(e); 
      });

      const embed = new MessageEmbed()
        .setTitle('⚠️ Watcher has encountered an error with this command.')
        .setDescription(`Please report this error to our support server and attatch this ID when reporting. ID: **${IDstring}**`)
        .setTimestamp()
        .setColor('#FF0000');
      
      return await message.channel.send(embed);
    } 
    // command.execute(message).catch((e) => console.log('the error has been catched' + e));

  }
};
