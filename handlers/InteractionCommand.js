class InteractionCommand {
  constructor(client, filePath, {name, cooldown}) {
    this.client = client;
    this.path = filePath;
    this.name = name || null;
    this.cooldown = cooldown || 3;
  }
}
  
module.exports = InteractionCommand;