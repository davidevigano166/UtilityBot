var fs = require('fs');

const Discord = require('discord.js');
const { exit } = require('process');
const client = new Discord.Client();

const commands = { // Commands
	cmdhelp: 'help',
  cmdmembers: 'members',
  cmdinfo: 'info',
  cmdtime: 'time',
  cmddate: 'date',
  cmdkick: 'kick',
  cmdban: 'ban',
  cmdrandom: 'random'
}

client.on('ready', () => { // Initial Function
  console.log("Logged in as " + client.user.tag);
  client.user.setStatus("online");
  client.user.setPresence({ activity: { name: 'use $help'}, status: 'online'});
});

client.on('message', msg => { // Replies
  if (msg.content.substring(0, 1) === '$') {
    let command = msg.content.substring(1).split(' ')[0];
	  switch (command) {
		  case commands.cmdhelp: 
        let str = 'Available commands: \n';
        for (var x in commands) {
          if (x === 'cmdkick') {
            str += '$' + commands[x] + ' [@user]' + '\n';
          } else if (x === 'cmdban') {
            str += '$' + commands[x] + ' [@user]' + '\n';
          } else {
            str += '$' + commands[x] + '\n';
          }
        }
		  	msg.channel.send(str);
			  break;
		  case commands.cmdmembers:
        let guildvar = client.guilds.fetch('768524986905526342').then(guild => msg.channel.send('There are ' + guild.memberCount + ' members'));
        break;
      case commands.cmdinfo:
        let namevar = client.guilds.fetch('768524986905526342').then(guild => msg.channel.send('Server name: ' + guild.name));
        break;
      case commands.cmdtime:
        let timevar = new Date();
        msg.channel.send('It is ' + timevar.getHours() + ':' + timevar.getMinutes() + ':' + timevar.getSeconds());
        break;
      case commands.cmddate:
        let datevar = new Date();
        let month = parseInt(datevar.getMonth())+1;
        msg.channel.send('Today is ' + datevar.getDate() + '-' + month + '-' + datevar.getFullYear());
        break;
      case commands.cmdkick:
        const users_to_kick = msg.mentions.members;
        if (msg.member.hasPermission('KICK_MEMBERS')) {
          if (users_to_kick) {
            users_to_kick.forEach(user => {
              user.kick().then().catch(() => {
                msg.channel.send('You can not kick an user with higher permissions than yours');
              });
            })
          }
        } else {
          msg.channel.send('You do not have permissions to kick');
        }
        break;
      case commands.cmdban:
        const users_to_ban = msg.mentions.members;
        if (msg.member.hasPermission('BAN_MEMBERS')) {
          if (users_to_ban) {
            users_to_ban.forEach(user => {
              user.ban().then().catch(() => {
                msg.channel.send('You can not ban an user with higher permissions than yours');
              });
            })
          }
        } else {
          msg.channel.send('You do not have permissions to ban');
        }
        break;
      case commands.cmdrandom:
        msg.channel.send('Your random number is ' + Math.floor(Math.random() * 101));
        break;
	  }
  }
});

client.on('guildMemberAdd', member => { // Welcome Message
    const channel = member.guild.channels.cache.find(ch => ch.name === 'generale');
    if (!channel) return;
    channel.send(`Benvenuto nel server, ${member}!`);
});

function startUp() { // StartUp Function
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