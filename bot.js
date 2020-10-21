var fs = require('fs');

const Discord = require('discord.js');
const { exit } = require('process');
const client = new Discord.Client();

const commands = {
	cmdgreetings: 'ciao',
	cmdhours: 'ore'
}

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag);
});

client.on('message', msg => {
  if (msg.content.substring(0, 1) === '?') {
	let command = msg.content.substring(1);
	switch (command) {
		case commands.cmdgreetings:
			msg.reply('Ciao');
			break;
		case commands.cmdhours:
			msg.reply(new Date().getHours());
			break;
	}
    msg.reply('Comando ricevuto: ' + command);
  }
});

function startUp() {
    try {
        var tokenauth = fs.readFileSync('./auth.json');
        tokenauth = JSON.parse(tokenauth).token;
        client.login(tokenauth);
    } catch (error) {
        console.log('Error' + error);
        exit();
    }
}

startUp();