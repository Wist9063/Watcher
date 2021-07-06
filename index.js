/* Copyright (C) Cloud Development 2017-2021 - All Rights Reserved
 * Unauthorized copying of any file in this repo, via any medium is strictly prohibited.
 * Proprietary and confidential.
 * Written by wist9063 <me@joshlol.xyz> & jason.
 * 
 * __/\\\______________/\\\_____________________________________________/\\\______________________________________        
 *  _\/\\\_____________\/\\\____________________________________________\/\\\______________________________________       
 *   _\/\\\_____________\/\\\____________________/\\\____________________\/\\\______________________________________      
 *    _\//\\\____/\\\____/\\\___/\\\\\\\\\_____/\\\\\\\\\\\_____/\\\\\\\\_\/\\\_____________/\\\\\\\\___/\\/\\\\\\\__     
 *     __\//\\\__/\\\\\__/\\\___\////////\\\___\////\\\////____/\\\//////__\/\\\\\\\\\\____/\\\/////\\\_\/\\\/////\\\_    
 *      ___\//\\\/\\\/\\\/\\\______/\\\\\\\\\\_____\/\\\_______/\\\_________\/\\\/////\\\__/\\\\\\\\\\\__\/\\\___\///__  
 *       ____\//\\\\\\//\\\\\______/\\\/////\\\_____\/\\\_/\\__\//\\\________\/\\\___\/\\\_\//\\///////___\/\\\_________  
 *        _____\//\\\__\//\\\______\//\\\\\\\\/\\____\//\\\\\____\///\\\\\\\\_\/\\\___\/\\\__\//\\\\\\\\\\_\/\\\_________
 *         ______\///____\///________\////////\//______\/////_______\////////__\///____\///____\//////////__\///__________ 
 * 
 */

const path = require('path');
const sentry = require('@sentry/node');
const statsd = require('hot-shots');
const klaw = require('klaw');
const { Client, Collection, Intents } = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const intents = new Intents();
intents.add('GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS', 'GUILD_WEBHOOKS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS');

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

new class extends Client {
  constructor() {
    super({      
      intents: intents,
      allowedMentions: {parse: ['users', 'roles']},
      messageCacheLifetime: 200,
      messageSweepInterval: 300,
      messageCacheMaxSize: 150,
      restTimeOffset: 1000,
      restGlobalRateLimit: 40,
      presence: {
        activities: [{name: 'launching watcher..', type: 'COMPETING'}]
      }
    });

    this.config = require('./config.js');
    sentry.init({ dsn: `https://${process.env.sDSN}@sentry.io/${process.env.sID}`, environment: process.env.NODE_ENV });
    this.datadog = new statsd();
    this.eventsend = 0;
    this.commands = new Collection();
    this.mongod = new MongoClient(`mongodb+srv://${process.env.mdbKEY}@watcherdev-too26.azure.mongodb.net/test?retryWrites=true&w=majority`, { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 15, tls: true});
    this.init();
    this.initEvents();
    this.connect();
  }

  async connect() {
    console.log('<---------------->');
    console.log('Initializing connection to Discord & MongoDB Atlas Platform.');

    await this.mongod.connect().then(() => console.log('MongoDB Atlas connection successful.')).catch(e => {
      sentry.captureException(e); 
      console.error('An error has occurred during the connecting phase for MongoDB Atlas connection, check sentry!');
      console.error(e);
    });

    await this.login().then(() => console.log('Discord connection established.')).catch(e => {
      sentry.captureException(e); 
      console.error('An error has occurred during the connecting phase for the DiscordAPI connection, check sentry!');
      console.error(e);
    });

    sentry.addBreadcrumb({
      category: 'botLogin',
      message: 'Connected to discord API.',
      level: sentry.Severity.Info
    }); 
  }

  async reloadCommands() {
    console.log('Command reload triggered.');
    await klaw(commandsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext != '.js') return;
      const fileName = `${file.dir}/${file.base}`;
      delete require.cache[require.resolve(fileName)];
      const command = new (require(fileName))(this);
      this.commands.set(command.name, command);
    });
    return 'Command Reloading Finished.';
  }

  async reloadEvents() {
    console.log('Events reload triggered.');
    await klaw(eventsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext != '.js') return;
      const fileName = `${file.dir}/${file.base}`;
      delete require.cache[require.resolve(fileName)];
      const event = new (require(fileName))(this);
      this.on(event.name, event.execute);
    });
    return 'Event Reloading Finished.';
  }

  fetchCommand(text) {
    return new Promise((resolve) => {
      if (this.commands.has(text)) return resolve(this.commands.get(text));
      this.commands.forEach(c => { if (c.aliases && c.aliases.includes(text)) return resolve(c); });
      return resolve();
    });
  }

  init() {
    klaw(commandsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext !== '.js') return;

      const command = new (require(`${file.dir}/${file.base}`))(this);
      this.commands.set(command.name, command);
      sentry.addBreadcrumb({
        category: 'initEvent',
        message: 'initialized commands.',
        level: sentry.Severity.Info
      });
    });
  }

  initEvents() {
    klaw(eventsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext !== '.js') return;

      const event = new (require(`${file.dir}/${file.base}`))(this);
      this.on(event.name, event.execute);
      sentry.addBreadcrumb({
        category: 'initEvent',
        message: 'initialized events.',
        level: sentry.Severity.Info
      });
    });
  }

};

process.on('uncaughtException', err => console.error(err.stack, true) && sentry.captureException(err.stack));
process.on('unhandledRejection', err => console.error(err.stack, true) && sentry.captureException(err.stack));

// end of file, move fast break things 
