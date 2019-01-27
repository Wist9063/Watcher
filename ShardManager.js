const { ShardingManager } = require("discord.js");
const { token } = require("./config.js");
const sm = new ShardingManager("./index.js", { token });
sm.spawn();