/* Copyright (C) Cloud Development 2017-2020 - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 * Written by wist9063 <wist9063@gmail.com> & jason.
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
const klaw = require('klaw');
const { Client, Collection, discord } = require('discord.js');

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

new class extends Client {
  constructor() {
    super({
      disableEveryone: true
    });

    this.config = require('./config.js');
    sentry.init({ dsn: `https://${this.config.sentryDSN}@sentry.io/${this.config.sentryID}`, environment: this.config.sentryLevel });
    this.discord = discord;
    this.commands = new Collection();
    this.init();
    this.initEvents();
    this.connect();
  }

  connect() {
    console.log('<---------------->');
    console.log('Initializing connection to discord.');
    this.login(this.config.token);

    console.log('Token successful, connecting.');
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
        message: 'initialized event.',
        level: sentry.Severity.Info
      });
    });
  }

};

process.on('uncaughtException', err => console.error(err.stack, true) && sentry.captureException(err.stack));
process.on('unhandledRejection', err => console.error(err.stack, true) && sentry.captureException(err.stack));

// end of file, made by jason, now maintained by wist9063. *made with love and keystrokes*