class Command {
    constructor(client, filePath, {name, aliases}) {
        this.client = client;
        this.path = filePath;
        this.name = name || "NULL";
        this.aliases = aliases || [];
    }
}

module.exports = Command;
