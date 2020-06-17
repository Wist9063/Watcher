const { MessageEmbed } = require('discord.js');
const Command = require('../../handlers/command.js');


module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'help',
      aliases: ['cmds', 'commands']
    });
  }
  execute(message) {
    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle('Watcher | The Advanced Logging Bot')
      .setDescription('**Prefix**: `w!`\n\nWatcher provides your server with feature-rich advanced customizable logging features, to enhance your user experience.\n\nEvents we currently support:\nchannelCreate, channelDelete, guildBanAdd, guildBanRemove, guildMemberAdd, guildMemberRemove, guildMemberUpdate, messageDelete, messageReactionAdd, messageReactionRemove, messageUpdate, voiceStateUpdate\n\n__*Special thanks to Nettle#2222 for keeping the project alive!*__')
      .setURL('https://discord.gg/83SAWkh')
      .setThumbnail(this.client.user.displayAvatarURL())
      .addField('Information [5]', '`settings`, `help`, `invite`, `userinfo`, `info`')
      .addField('Utility [4]', '`perm`, `ping`, `avatar`, `setup`')
      .addField('Moderation [1]', '`purge`')
      .addField('Settings [16]', '`channelcreate`, `channeldelete`, `all-off`, `all-on`, `guildbanadd`, `guildbanremove`, `guildmemberadd`, `guildmemberremove`, `guildmemberupdate`, `log-channel`, `messagedelete`, `messagebulkdelete`, `messageupdate`, `roleCreate`, `voicestateupdate`, `messageReactionAdd`, `messageReactionRemove`')
      .addField('Support Server', '[https://discord.gg/83SAWkh](https://discord.gg/83SAWkh)')
      .addField('Donate', '[https://www.patreon.com/watcherbot](https://www.patreon.com/watcherbot)')
      .addField('Setup Guide', 'Run the command `w!setup`.')
      .setFooter('Made by wist9063 & jason. *made with love and keystrokes* :)');
    return message.channel.send(embed);
  }
};