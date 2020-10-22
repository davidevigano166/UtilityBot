var fs = require('fs');

const Discord = require('discord.js');
const { exit } = require('process');
const client = new Discord.Client();

const commands = {
	cmdhelp: 'help',
  cmdinfo: 'info',
  cmdtime: 'time'
}

client.on('ready', () => {
  console.log("Logged in as " + client.user.tag);
  client.user.setStatus('online');
  client.user.setPresence({ activity: { name: 'use <help'}, status: 'online'});
});

client.on('message', msg => {
  if (msg.content.substring(0, 1) === '<') {
	  let command = msg.content.substring(1);
	  switch (command) {
		  case commands.cmdhelp:
        let str = 'these are the commands available: ';
        for (var x in commands) {
          str += commands[x] + ', ';
        }
		  	msg.reply(str);
			  break;
		  case commands.cmdinfo:
        let guildvar = client.guilds.fetch('768524986905526342').then(guild => msg.reply('total members: ' + guild.memberCount));
        break;
      case commands.cmdtime:
        let timevar = new Date();
        msg.reply('the time is ' + timevar.getHours() + ':' + timevar.getMinutes() + ':' + timevar.getSeconds());
	  }
  }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'generale');
    if (!channel) return;
    channel.send(`Benvenuto nel server, ${member}!`);
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