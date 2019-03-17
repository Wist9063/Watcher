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

  execute(message) {

    const match = /(?:perm)\s{0,}(?:(?:(?:<@!?)?(\d{17,20})>?))?/i.exec(message.content);
    if (!match) return message.channel.send('Invalid Usage: `w!perm [mention]`');

    let array, level, def;

    if (!match[1]) array = Permissions.fetch(this.client, message);
    if (match[1]) array = Permissions.fetchOther(this.client, message);
    if (array !== 'err') {
      level = array[0];
      def = array[1];
    } else return message.channel.send('An error has occured.');

    const embed = new MessageEmbed()
      .setTitle(`Permission Level for ${match[1] ? message.guild.members.get(match[1]).user.username : message.author.username}`)
      .setDescription(`${def}\n**Permission Level:** **${level}**`)
      .setFooter(`Requested by ${message.author.tag}`)
      .setColor(0xcc8822);
    message.channel.send(embed);
  }
};
