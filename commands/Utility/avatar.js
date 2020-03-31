const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const sm = require('string-similarity');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'avatar',
      aliases: ['pic', 'pfp']
    });
  }

  async execute(message) {
    const args = message.content.slice(this.client.config.prefix.length).trim().split(' ');
    const members = [];
    const indexes = [];

    message.guild.members.cache.forEach(async member => {
      members.push(member.user.username);
      indexes.push(member.id);
    });

    const match = sm.findBestMatch(args.join(' '), members);
    const username = match.bestMatch.target;

    const member = message.guild.members.cache.get(indexes[members.indexOf(username)]);
    const user = message.mentions.users.first();

    if (user) {
      const embed = new Discord.MessageEmbed()
        .setColor(this.client.settings.colors.blank)
        .setAuthor(user.tag, user.avatarURL())
        .setImage(user.avatarURL({ 'size': 2048 }));
      return message.channel.send(embed);
    } else if (!user) {
      const search = member.user;
      const value = args[1];
      if (!value) {
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.avatarURL())
          .setImage(message.author.avatarURL({ 'size': 2048 }));
        return message.channel.send(embed);
      } else if (search.username.toLowerCase().includes(value.toLowerCase())) {
        const embed = new Discord.MessageEmbed()
          .setAuthor(search.tag, search.avatarURL())
          .setImage(search.avatarURL({ 'size': 2048 }));
        return message.channel.send(embed);
      } else {
        return message.channel.send('', { embed: { 'author': { 'name': message.author.tag, 'icon_url': message.author.avatarURL() }, 'description': `${this.client.emojis.get('506673020014952448')} **Too many users found, please try being more specific.**`, 'color': 0xFF0000 } });
      }
    }
  }
};