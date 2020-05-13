const Command = require('../../handlers/command.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'debug',
      aliases: []
    });
  }

  execute(message) {
    if (message.perm < 9) return;
    await db.get('502895390807293963', this.client.mongod, 'guildSettings').then((b) => {

      console.log(b);
    });
    

  }
};
