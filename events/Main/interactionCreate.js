const BotEvent = require('../../handlers/event.js');
//const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');


module.exports = class extends BotEvent {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'interactionCreate'
    });
  }

  async execute(interaction) {
    if (!interaction.isCommand()) return;
    console.log(interaction);
    const command = await this.fetchInterCommand(interaction.commandName);

    try { 
      console.log(`[${moment(new Date).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss A')}] [SLASH] - User ${interaction.user.username} (${interaction.user.id}) issued server command /${command.name} in ${interaction.guild.name} (${interaction.guild.id}), #${interaction.channel.name}.`);
      command.execute(interaction);
      this.datadog.increment('watcher_cmd_exe');
    } catch (e) {
      console.log(e);
        
    } 

    //if (interaction.commandName === 'ping') await interaction.reply({ content: 'Pong!', ephemeral: true });
  }

};