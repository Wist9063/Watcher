const Command = require('../../handlers/command.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'setup'
    });
  }
  execute(message) {
    const info_line = '**Thanks for inviting me! First and foremost, to setup the bot, you are required to invite it first. Once the bot is in your server, follow these steps below:**';
    const step_one = '`[1]` **Set a log channel.**\nSetting a log channel is simple and easy, simply run `w!log-channel #channel`. In addition, make sure that the bot has the __**Administrator**__ permission to ensure the bot is able to log events that is happening in your server.';
    const step_two = '`[2]` **Enable/Disable modules.**\nNow for the best part, logging modules. Run the command `w!modules`, and enable the modules you\'d like to log. __**Keep in mind that the whole command must be lowercase**__. (e.g `w!guildmemberjoin on`)';
    const step_three = '`[3]` **Finalizing.**\nFinalize the modules you\'d like to log, and you can now rest and know that your server has an advanced Discord logging bot! Moreover, if you require support or if you\'d like to suggest a neat logging feature, simply join our support server below.\n**https://discord.gg/EH7jKFH**';
    const donate = '`[4]` If you like the bot and want to keep it up and running, please consider donating to our patreon. *pls <3* **<https://www.patreon.com/watcherbot>**';
    return message.channel.send(`${info_line}\n\n${step_one}\n\n${step_two}\n\n${step_three}\n\n${donate}`);
  }
};