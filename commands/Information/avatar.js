const Command = require("../../handlers/command.js");
const Discord = require("discord.js");
const sm = require("string-similarity");

module.exports = class extends Command {
   constructor(client, filePath) {
      super(client, filePath, {
         name: "avatar",
         aliases: ["pic", "pfp"]
      });
   }

   async execute(message) {
      let args = message.content.slice(this.client.config.prefix.length).trim().split(" ");
      let members = [];
      let indexes = [];

      message.guild.members.forEach(async member => {
         members.push(member.user.username);
         indexes.push(member.id);
      });

      let match = sm.findBestMatch(args.join(" "), members);
      let username = match.bestMatch.target;

      let member = message.guild.members.get(indexes[members.indexOf(username)]);
      let user = message.mentions.users.first();

      if (user) {
         const embed = new Discord.MessageEmbed()
            .setColor(this.client.settings.colors.blank)
            .setAuthor(user.tag, user.avatarURL())
            .setImage(user.avatarURL({ "size": 2048 }))
         return message.channel.send(embed);
      } else if (!user) {
         let search = member.user;
         let value = args[1];
         if (!value) {
            const embed = new Discord.MessageEmbed()
               .setAuthor(message.author.tag, message.author.avatarURL())
               .setImage(message.author.avatarURL({ "size": 2048 }))
            return message.channel.send(embed);
         } else if (search.username.toLowerCase().includes(value.toLowerCase())) {
            const embed = new Discord.MessageEmbed()
               .setAuthor(search.tag, search.avatarURL())
               .setImage(search.avatarURL({ "size": 2048 }))
            return message.channel.send(embed);
         } else {
            return message.channel.send("", { embed: { "author": { "name": message.author.tag, "icon_url": message.author.avatarURL() }, "description": "<:no:510965304722194453> **Too many users found, please try being more specific.**", "color": 0xFF0000 } });
         }
      }
   }
}