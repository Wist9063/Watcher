class Command {
  constructor(client, filePath, {name, aliases, disabled, cooldown}) {
    this.client = client;
    this.path = filePath;
    this.name = name || null;
    this.disabled = disabled || null;
    this.cooldown = cooldown || 3;
    this.aliases = aliases || [];
  }
}

module.exports = Command;
