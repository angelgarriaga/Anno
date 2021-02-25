const Discord = require("discord.js");
const fs = require("fs");
const readFile = require("fs/promises");
const cron = require('node-cron');
const readlineSync = require('readline-sync');

const client = new Discord.Client();

const token = fs.readFileSync("token.txt").toString();

client.once("ready", () => {
	console.log("Ready!");
});

// Commands
let commands = new Map();
commands.set("help", message => {
    message.channel.send(fs.readFileSync("commandlist.txt").toString());
});
commands.set("queue", message => {
	message.channel.send("I am listening and ready to queue...")
    let filter = m => !m.author.bot;
    let collector = new Discord.MessageCollector(message.channel, filter);
    collector.on('collect', (message, col) => {
        console.log("Collected Message: " + message.content);
        collector.stop();
        console.log("Sucessfully queued.");
        message.channel.send("Gotcha! I have added that to the queue.");
    });
    collector.on('end', collected => {
        console.log("Message collected: " + collected.size);
        collector.stop();
        
    });
})


client.on("message", message => {
    if (message.content.startsWith('?')) {
        const command = message.content.split(" ")[0].substr(1); // gets the command name
        if (commands.has(command)) { // checks if the map contains the command
            commands.get(command)(message) // runs the command
        }
    }
});

client.login(token);