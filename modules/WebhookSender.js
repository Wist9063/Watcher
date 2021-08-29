const { WebhookClient } = require('discord.js');

module.exports = async pkg => { 
  if (!pkg.webhook) return;
  const logChannel = new WebhookClient({id: pkg.webhook.id, token: pkg.webhook.token});

  logChannel.send({embeds: [pkg.embed]}).catch( e => {
    if (e.code === '10015') {
      console.log('found unexisting webhook. deleting...');
    }
  });
};