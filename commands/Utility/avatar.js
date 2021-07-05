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
        .setAuthor(user.tag)
        .setImage(user.avatarURL({ 'size': 2048, dynamic: true }));
      return await message.channel.send({ embeds: [embed] });
    } else if (!user) {
      const search = member.user;
      const value = args[1];
      if (!value) {
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag)
          .setImage(message.author.avatarURL({ 'size': 2048, dynamic: true }));
        return await message.channel.send({ embeds: [embed] });
      } else if (search.username.toLowerCase().includes(value.toLowerCase())) {
        const embed = new Discord.MessageEmbed()
          .setAuthor(search.tag)
          .setImage(search.avatarURL({ 'size': 2048, dynamic: true }));
        return message.channel.send({ embeds: [embed] });
      } else {
        //return message.channel.send('', { embed: { 'author': { 'name': message.author.tag, 'icon_url': message.author.avatarURL() }, 'description': `${this.client.emojis.cache.get('506673020014952448')} **Too many users found, please try being more specific.**`, 'color': 0xFF0000 } });
        return await message.channel.send(`${this.client.emojis.cache.get('506673020014952448')} **Too many users found, please try being more specific.**`);
      }
    }
  }
};