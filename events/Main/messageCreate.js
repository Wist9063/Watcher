const BotEvent = require('../../handlers/event.js');
const sentry = require('@sentry/node');
const Discord = require('discord.js');
const log = require('../../modules/logger.js');
const cooldowns = new Discord.Collection();

function randomString(length) {
  const pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890';
  let str = 0;
  for (let i = 0; i < length; i++) {
    str += pos.charAt(Math.floor(Math.random() * pos.length));
  }
  return str;
}

module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'messageCreate'
    });
  }
  
  async execute(message) {
    if (!message.guild || message.author.bot) return;
    //message.mentions.users = message.mentions.users.filter(u => u.id != this.user.id);
    message.perm = await new (require('../../handlers/permission.js'))().fetch(message.author, message)[0];
    if (message.content.substring(0, this.config.prefix.length) != this.config.prefix) return;
    const content = message.content.slice(this.config.prefix.length);
    const command = await this.fetchCommand(content.split(' ')[0]);
    if (!command) return;
    if (command.disabled == true) return message.channel.send(`This command is globally disabled. Please try this command again at a later time or date.\n${command.disabledReason}`);
    // if (!message.channel.permissionsFor(message.guild.me).has(this.config.requiredPermissions)) return message.channel.send(`INVALID PERMISSIONS: Watcher requires the following permissions: \n${this.config.requiredPermissions.map(p => p)}`);
    if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        return log('USER RATELIMITED', `Action has been ratelimited. User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try { 
      if (!this.config.maintenance) {
        await message.channel.sendTyping();
        log('COMMAND', `User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);        
        await command.execute(message);
        this.datadog.increment('watcher_cmd_exe');
      } else {
        message.channel.sendTyping();
        log('COMMAND', `User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);        
        command.execute(message);
        if (content.split(' ')[1] != '--force') {
          await message.channel.send('Watcher is currently undergoing maintenance and will not be responding to any commands. Please check our hub for maintenance times. __**<https://discord.gg/83SAWkh>**__');
        } else if (content.split(' ')[1] === '--force' && message.perm > 9) {
          message.channel.sendTyping();
          message.content = message.content.replace('--force', '');
          message.channel.send('This command has been forced to run while Watcher is in maintenance mode.');
          log('WARNING! COMMAND', `Executed using --force. - User ${message.author.username} (${message.author.id}) issued server command ${this.config.prefix}${command.name} in ${message.guild.name} (${message.guild.id}), #${message.channel.name}.`);        
          command.execute(message);
        }
      }
    } catch (e) {
      if (e.code === 50013 || e.httpStatus === 403 || e === 'DiscordAPIError: Missing Permissions') {
        log('PERM COMMAND ERROR!', 'Had to send a message for perms!');      
        return message.author.send(`I couldn't send send a message back to ${message.channel}!\nPlease make sure I have the \`Administrator\` permission so I can send/receive messages & log events in your server more faster.`);
      }

      const IDstring = randomString(5);
      log('COMMAND ERROR!', `[ID:${IDstring}]\n${e}`);        


      sentry.withScope(function(scope) {
        scope.setUser({id: message.author.id, username: message.author.username});
        scope.setTag('errorID', IDstring);
        scope.setTag('cmd_Name', command.name);
        scope.setLevel('error');
        sentry.captureException(e); 
      });

      const embed = new Discord.MessageEmbed()
        .setTitle('⚠️ Watcher has encountered an error with this command.')
        .setDescription(`Watcher has encountered an error with this command & has logged this error.\nError: \`${e}\``)
        .setTimestamp()
        .setFooter(`Error ID: ${IDstring}`)
        .setColor('#FF0000');
      return await message.channel.send({ embeds: [embed] });
    } 
  }
};

