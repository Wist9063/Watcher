const Command = require('../../handlers/command.js');
const config = require('../../config.js');
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'announce',
      aliases: [],
      onlyOwner: true
    });
  }

  async execute(message) {
    if (!config.owners.includes(message.author.id)) return;
    const cursor = await this.client.mongod.db(process.env.WATCHER_DB).collection('guildSettings').find();
    const count = await cursor.count();
    const embed = new MessageEmbed()
      .setColor('#7289DA')
      .setTitle('Testing Global Announcements')
      .setAuthor('Watcher Announcement', 'https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048')
      .setDescription('Test Message.\n\nThese types of messages will be used to announce upcoming maintenance times and updates coming to Watcher.')
      .setFooter('This message is sent on behalf of the developer of Watcher.')
      .setTimestamp();

    await cursor.each(function(err, item) {
      if (item == null) {
        return;
      }
      if (item.wb.wbID == null) {return;}    

      const logChannel = new WebhookClient({id: item.wb.wbID, token: item.wb.wbKey});
      return logChannel.send({ embeds: [embed], username: 'Watcher Announcements' });
    }); 
    message.reply({content: `Sent announcements to **${count}** channels with the message:`, embeds: [embed] });
  }
};