
const fs = require('fs');
const Discord = require('discord.js');
const { PREFIX, TOKEN } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// config({
//     path: __dirname + "/.env"
// });

client.on('message', async msg => {
	if (!msg.content.startsWith(PREFIX) || msg.author.bot || !msg.guild) return;

    // command handler
    const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if (command === 'ping') {
		  client.commands.get('ping').execute(msg, args);
    } else if (command === 'transcribe') {
      client.commands.get('transcribe').execute(msg, args);
    } else if (command === 'setup') {
      client.commands.get('setup').execute(msg, args);
    }
});

// client.login(process.env.TOKEN);

client.login(TOKEN);