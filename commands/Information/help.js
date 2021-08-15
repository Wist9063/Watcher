const { MessageEmbed } = require('discord.js');
const Command = require('../../handlers/command.js');


module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'help',
      aliases: ['cmds', 'commands']
    });
  }
  async execute(message) {
    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle('Watcher | The Advanced Logging Bot')
      .setDescription('**Prefix**: `w!`\n**To get started, run `w!setup`.**\nNeed help setting up Watcher? Join our support server [here](https://discord.gg/YyGaApfrTc)!\n\nWatcher provides your server with feature-rich advanced customizable logging features, to enhance your user experience.\n\nEvents we currently support:\nchannelCreate, channelDelete, guildBanAdd, guildBanRemove, guildMemberAdd, guildMemberRemove, guildMemberUpdate & more!\n\n__**Special thanks to Nettle#2222 for donating & keeping the project alive!**__\nCheck out our privacy policy [here](https://www.notion.so/Watcher-Privacy-Policy-270fc96623d84176beac89bc6a20dae4)! \n\n**Available commands are listed below.**')
      .setURL('https://discord.gg/83SAWkh')
      .setThumbnail(this.client.user.displayAvatarURL())
      .addField('Information [6]', '`settings`, `help`, `invite`, `info`, `privacy`')
      .addField('Utility [4]', '`perm`, `ping`, `avatar`, `setup`, `userinfo`, `serverinfo`')
      .addField('Moderation [1]', '`purge`')
      .addField('Settings [16]', '`channelcreate`, `channeldelete`, `all-off`, `all-on`, `guildbanadd`, `guildbanremove`, `guildmemberadd`, `guildmemberremove`, `guildmemberupdate`, `log-channel`, `messagedelete`, `messagebulkdelete`, `messageupdate`, `roleCreate`, `roleDelete`, `voicestateupdate`, `messageReactionAdd`, `messageReactionRemove`')
      .addField('Donate', '[https://www.patreon.com/watcherbot](https://www.patreon.com/watcherbot)')
      .setFooter('Made by wist9063. Original Idea by jason.#1234 - yo');
    return await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
  }
};