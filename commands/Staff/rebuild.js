const Command = require('../../handlers/command.js');
const qdb = require('quick.db');

module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: 'rebuild',
      aliases: []
    });
  }

  async execute(message) {
    if (message.perm < 9) return;
    const qdb = require('quick.db');
    const g = this.client.guilds.cache.array();
    await g.forEach(function(item) {
      if (qdb.has(`guild_${item.id}.logChannel`) && item.channels.cache.has(qdb.get(`guild_${item.id}.logChannel.id`))) {
        const channel = item.channels.cache.get(qdb.get(`guild_${item.id}.logChannel.id`));
        channel.send('**Watcher Planned Maintenance**\n\n__Watcher__ will undergo maintenance on __May 11, 2020 at 10:00 PM__ **to** __May 12, 2020 12:00AM__ __**(Pacific Standard Time)**__. *Remember that this time may be extended due to complications.*\nCountdown: *<https://www.timeanddate.com/countdown/to?iso=20200511T22&p0=137&font=cursive>*\nDuring this time, Watcher will be unresponsive and **will not** be logging and sending events.\n\nThis maintenance will be used to update Watcher from version `1.5.5-prod` to version `1.6.0-prod`. This version fixes numerous bugs with Watcher like data loss *moving to a new database system*, some event logs not sending, and internal bugs. This version introduces a new way of sending events. Watcher will start using ***webhooks*** to send events to your log channel.\n**Your set log channel *may* be erased from the database** however rest of your data like event settings and ignored channels will be safe.\n\nSorry for the inconvenience, from **Watcher Development Team.**');
        console.log('sent msg to ' + channel.id);
      }
    });
  }
};