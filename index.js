/* Copyright (C) HexaplexSoftware 2017-2018 - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 * Written by wist9063 <wist9063@gmail.com> & jason.
 */

const path = require('path');
const log = require('umi-log');
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
    this.discord = discord;
    this.connect();
    this.commands = new Collection();
    this.init();
    this.initEvents();
    this.login(this.config.token);
  }

  connect() {
    log.info('[Discord] Connecting to Discord..');
  }

  reloadCommands() {
    console.log('Command reload triggered.');
    klaw(commandsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext != '.js') return;
      const fileName = `${file.dir}/${file.base}`;
      delete require.cache[require.resolve(fileName)];
      const command = new (require(fileName))(this);
      this.commands.set(command.name, command);
    });
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
    });
  }

  initEvents() {
    klaw(eventsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext !== '.js') return;

      const event = new (require(`${file.dir}/${file.base}`))(this);
      this.on(event.name, event.execute);
    });
  }

};

process.on('uncaughtException', err => log.error(err.stack, true));
process.on('unhandledRejection', err => log.error(err.stack, true));