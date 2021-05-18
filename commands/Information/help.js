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
      .setColor('#428bca')
      .setTitle('Watcher | The Advanced Logging Bot')
      .setDescription('**Prefix**: `w!`\n\nWatcher provides your server with feature-rich advanced customizable logging features, to enhance your user experience.\n\nEvents we currently support:\nchannelCreate, channelDelete, guildBanAdd, guildBanRemove, guildMemberAdd, guildMemberRemove, guildMemberUpdate & more!\n\n__*Special thanks to Nettle#2222 for donating & keeping the project alive!*__')
      .setURL('https://discord.gg/83SAWkh')
      .setThumbnail(this.client.user.displayAvatarURL())
      .addField('Information [6]', '`settings`, `help`, `invite`, `info`, `privacy`')
      .addField('Utility [4]', '`perm`, `ping`, `avatar`, `setup`, `userinfo`, `serverinfo`')
      .addField('Moderation [1]', '`purge`')
      .addField('Settings [16]', '`channelcreate`, `channeldelete`, `all-off`, `all-on`, `guildbanadd`, `guildbanremove`, `guildmemberadd`, `guildmemberremove`, `guildmemberupdate`, `log-channel`, `messagedelete`, `messagebulkdelete`, `messageupdate`, `roleCreate`, `roleDelete`, `voicestateupdate`, `messageReactionAdd`, `messageReactionRemove`')
      .addField('Support Server', '[https://discord.gg/83SAWkh](https://discord.gg/83SAWkh)')
      .addField('Donate', '[https://www.patreon.com/watcherbot](https://www.patreon.com/watcherbot)')
      .addField('Setup Guide', 'Run the command `w!setup`.')
      .setFooter('Made by wist9063. Original Idea by jason.#1234 - move fast break things');
    return message.channel.send(embed);
  }
};