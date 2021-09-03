const { WebhookClient } = require('discord.js');
const log = require('./logger.js');

module.exports = pkg => { 
  if (!pkg.webhook) return;
  const logChannel = new WebhookClient({id: pkg.webhook.id, token: pkg.webhook.token});

  logChannel.send({embeds: [pkg.embed], username: 'Watcher', avatar: 'https://cdn.discordapp.com/avatars/505571539333152781/cbf64e07e3991abb9b8847627dd2a2ab.webp?size=2048'}).catch( e => {
    if (e.code === 10015 || e.httpStatus === 404) {
      log('WEBHOOK', `found unexisting webhook. id: ${pkg.webhook.id}`);
    }
  });
};