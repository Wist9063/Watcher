const Command = require('../../handlers/command.js');
const Discord = require('discord.js');
const moment = require('moment');
const sm = require('string-similarity');

/*
function status(data, client) {
  if (data === 'online') {return client.emojis.cache.get('742109432451825754');} 
  else if (data === 'idle') {return client.emojis.cache.get('742109349060804719');} 
  else if (data === 'dnd') {return client.emojis.cache.get('742109349056610354');} 
  else if (data == 'STREAMING') {return client.emojis.cache.get('742109349077581824');} 
  else {return client.emojis.cache.get('742109432355356726');}
}

function game(data) {
  if (data === null) {return '';} 
  else if (data.type == 'STREAMING') {return `**Streaming** [${data.name}](${data.url})`;} 
  else if (data.type == 'LISTENING') {return `**Listening** to ${data.name} - **${data.details ? data.details+ ' by' : 'Listening data not available'}** ${data.state ? '__'+ data.state + '__' : ''}`;} 
  else if (data.type == 'WATCHING') {return `**Watching** ${data.name}`;} 
  else if (data.type == 'CUSTOM_STATUS') {return data.name;} 
  else {return `**Playing** ${data.name}`;}
} */

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'userinfo',
      aliases: ['ui', 'whois', 'lookup']
    });
  }

  async execute(message) {
    const args = message.content.slice(this.client.config.prefix.length).trim().split(' ');
    const members = [];
    const indexes = [];
    await message.guild.members.fetch();

    message.guild.members.cache.forEach(async member => {
      members.push(member.user.username);
      indexes.push(member);
    });

    const match = sm.findBestMatch(args.join(' '), members);
    const username = match.bestMatch.target;

    // message.guild.members.fetch(indexes[members.indexOf(username)]);
    //console.log(indexes[members.indexOf(username)])
    let member = await message.guild.members.fetch(indexes[members.indexOf(username)]);
    let user = message.mentions.users.first();

    if (user) {
      member = message.mentions.members.first();
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Info for ${user.tag}`, user.avatarURL({ 'size': 2048, dynamic: true }))
        // .setDescription(`${status(user.presence.status, this.client)} ${game(user.presence.activities[0] ? user.presence.activities[0] : null)}`)
        .addField('❯❯ Nickname',  member.nickname ? member.nickname : 'None', true)
        .addField('❯❯ Joined Server', `\`${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``, true)
        .addField('❯❯ Joined Discord', `\`${moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``, false)
        .addField(`❯❯ Roles (${member.roles.cache.size})`, member.roles.cache.map(role => role).join(' - '), false)
        .setFooter(`User ID: ${user.id}`)
        .setThumbnail(user.avatarURL({ 'size': 2048, dynamic: true }))
        .setColor('#7289DA');
      return await message.channel.send({embeds: [embed]});
    } else if (!user) {
      const search = member.user;
      const value = args[1];
      if (!value) {
        member = await message.guild.members.fetch(message.author);
        user = message.author;
        const embed = new Discord.MessageEmbed()
          .setAuthor(`Info for ${user.tag}`, user.avatarURL({ 'size': 2048, dynamic: true }))
          //.setDescription(`${status(user.presence.status, this.client)} ${game(user.presence.activities[0] ? user.presence.activities[0] : null)}`)
          .addField('❯❯ Nickname',  member.nickname ? member.nickname : 'None', true)
          .addField('❯❯ Joined Server', `\`${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``, true)
          .addField('❯❯ Joined Discord', `\`${moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``, false)
          .addField(`❯❯ Roles (${member.roles.cache.size})`, member.roles.cache.map(role => role).join(' - '), false)
          .setThumbnail(user.avatarURL({ 'size': 2048, dynamic: true }))
          .setFooter(`User ID: ${user.id}`)
          .setColor('#7289DA');
        await message.guild.members.cache.clear();
        return await message.channel.send({embeds: [embed]});
      } else if (search.username.toLowerCase().includes(value.toLowerCase())) {
        const embed = new Discord.MessageEmbed()
          .setAuthor(`Info for ${search.tag}`, search.avatarURL({ 'size': 2048, dynamic: true }))
          //.setDescription(`${status(search.presence.status, this.client)} ${game(search.presence.activities[0] ? search.presence.activities[0] : null)}`)
          .addField('❯❯ Nickname',  member.nickname ? member.nickname : 'None', true)
          .addField('❯❯ Joined Server', `\`${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``, true)
          .addField('❯❯ Joined Discord', `\`${moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss A')} (Pacific Standard Time)\``, false)
          .addField(`❯❯ Roles (${member.roles.cache.size})`, member.roles.cache.map(role => role).join(' - '), false)
          .setThumbnail(search.avatarURL({ 'size': 2048, dynamic: true }))
          .setFooter(`User ID: ${search.id}`)
          .setColor('#7289DA');
        await message.guild.members.cache.clear();
        return await message.channel.send({embeds: [embed]});
      } else {
        return await message.channel.send(`${this.client.emojis.cache.get('506673020014952448')} **Too many users found, please try being more specific.**`);
        //return message.channel.send('', { embed: { 'author': { 'name': message.author.tag, 'icon_url': message.author.avatarURL() }, 'description': `${this.client.emojis.cache.get('506673020014952448')} **This user could not be found, please try being more specific.**`, 'color': 0xFF0000 } });
      }
    }
  }
};