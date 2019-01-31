class BotEvent {
  constructor(client, filePath, {name}) {
    this.client = client;
    this.path = filePath;
    this.name = name;
  }
}

module.exports = BotEvent;