const Command = require('../../handlers/command.js');
const Permissions = new (require('../../handlers/permission.js'))();
const MessageEmbed = require('discord.js').MessageEmbed;

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'perm',
      aliases: []
    });
  }

  async execute(message) {
    let match = /^<@!?(\d+)>$/.test(message.content.split(' ')[1]);

    // Checks
    if (!/^<@!?(\d+)>$/.test(message.content.split(' ')[1])) match = message.author;
    if (!message.mentions.users) return message.channel.send(`${message.author} | You didn't mention a user. Usage: \`w!perm [@user]\``);
    if (/^<@!?(\d+)>$/.test(message.content.split(' ')[1])) match = message.mentions.users.first(); 

    let level, def;

    const array = await Permissions.fetch(match, message);
    if (array !== 'err') {
      level = array[0];
      def = array[1];
    } else { return await message.channel.send(`${message.author} | An error has occured while fetching the permissions. Please try again later.`); }

    const embed = new MessageEmbed()
      .setTitle(`Permission Level for ${match.username}`)
      .setDescription(`**${def}**\nPermission Level: __${level}__`)
      .setFooter(`Requested by ${message.author.tag}`)
      .setColor(0xcc8822);
    return await message.channel.send({embeds: [embed]});
  }
};
