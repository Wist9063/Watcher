class Command {
  constructor(client, filePath, {name, aliases}) {
    this.client = client;
    this.path = filePath;
    this.name = name || null;
    this.aliases = aliases || [];
  }
}

module.exports = Command;
