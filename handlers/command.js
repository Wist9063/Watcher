class Command {
  constructor(client, filePath, {name, aliases, disabled, cooldown , onlyOwner, disabledReason}) {
    this.client = client;
    this.path = filePath;
    this.name = name || null;
    this.disabled = disabled || null;
    this.cooldown = cooldown || 3;
    this.aliases = aliases || [];
    this.disabledReason = disabledReason || 'N/A';
    this.onlyOwner = onlyOwner || false;
  }
}

module.exports = Command;
