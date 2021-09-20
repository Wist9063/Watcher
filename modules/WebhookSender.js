const { WebhookClient } = require('discord.js');
const log = require('./logger.js');
const MongoClient = require('mongodb').MongoClient;
const db = new (require('../handlers/database.js'))();
const mongo = new MongoClient(`mongodb+srv://${process.env.mdbKEY}@watcherdev-too26.azure.mongodb.net/test?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true, tls: true});

module.exports = pkg => { 
  if (!pkg.webhook) return;
  const logChannel = new WebhookClient({id: pkg.webhook.id, token: pkg.webhook.token});

  logChannel.send({embeds: [pkg.embed], username: 'Watcher', avatar: 'https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048'})
    .catch( async e => {
      await mongo.connect();
      if (e.code === 10015 || e.httpStatus === 404) {
        log('WEBHOOK', `found unexisting webhook. attempting to delete this webhook... id: ${pkg.webhook.id}`);
        const deleted = await db.update(pkg.guildId, mongo, 'guildSettings', {'wb.wbID': null, 'wb.wbKey': null, 'wb.channelID': null});
        if (deleted === 1) {
          log('WEBHOOK', `succesfully deleted an unexisting webhook... id: ${pkg.webhook.id}`);
          await mongo.close();
        } else {
          log('WEBHOOK', `couldn't delete an unexisting webhook... id: ${pkg.webhook.id} error: ${deleted}`);
          await mongo.close();
        }
      }
    });
};