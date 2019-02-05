const path = require('path');
const log = require('umi-log');
const klaw = require('klaw');
const { Client, Collection, discord } = require('discord.js');

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

new class extends Client {
  constructor() {
    super();

    this.config = require('./config.js');
    this.discord = discord;
    this.connect();
    this.commands = new Collection();
    this.init();
    this.initEvents();
    this.gameCycle(discord);
    this.login(this.config.token);
  }

  connect() {
    log.info('[Discord] Connecting to Discord..');
  }

  async getAllShardsAvailable() {
    try {
      await this.shard.fetchClientValues('ping');
    } catch (e) {
      return false;
    }
    return true;
  }

  gameCycle(Client) {
    const games = [
      'your server. | w!help',
      `${this.guilds.size} guilds! | w!help`,
      'wist\'s logs. | w!help',
      'stuff. | w!help',
      'netflix. | w!help',
      `${this.users.size} users! | w!help`,
      'my server. | w!help',
      'discord. | w!help',
      'twitch. | w!help',
      'my mail. | w!help',
      'my code. | w!help',
      'youtube. | w!help'
    ];
    Client.user.setPresence({ activity: { name: games[Math.round(Math.random() * (games.length - 1))], type: 'WATCHING' } });
    return setTimeout(() => {
      this.user.gameCycle();
    }, 300000);
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

  convertTime(t) {
    const absoluteSeconds = parseInt((t / (1000)) % 60);
    const absoluteMinutes = parseInt((t / (1000 * 60)) % 60);
    const absoluteHours = parseInt((t / (1000 * 60 * 60)) % 24);
    const absoluteDays = parseInt((t / (1000 * 60 * 60 * 24)));

    const d = absoluteDays > 0 ? absoluteDays === 1 ? '1 day' : `${absoluteDays} days` : null;
    const h = absoluteHours > 0 ? absoluteHours === 1 ? '1 hour' : `${absoluteHours} hours` : null;
    const m = absoluteMinutes > 0 ? absoluteMinutes === 1 ? '1 minute' : `${absoluteMinutes} minutes` : null;
    const s = absoluteSeconds > 0 ? absoluteSeconds === 1 ? '1 second' : `${absoluteSeconds} seconds` : null;

    const absoluteTime = [];
    if (d) absoluteTime.push(d);
    if (h) absoluteTime.push(h);
    if (m) absoluteTime.push(m);
    if (s) absoluteTime.push(s);

    return absoluteTime.join(', ');
  }
};

process.on('uncaughtException', err => log.error(err.stack, true));
process.on('unhandledRejection', err => log.error(err.stack, true));
