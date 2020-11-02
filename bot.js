var fs = require('fs');
var https = require('https');

const Discord = require('discord.js');
const Weather = require('weather-js');
const { exit } = require('process');
const { parse } = require('path');
const client = new Discord.Client();

const commands = { // Commands
	cmdhelp: 'help',
  cmdmembers: 'members',
  cmdinfo: 'info',
  cmdtime: 'time',
  cmddate: 'date',
  cmdkick: 'kick',
  cmdban: 'ban',
  cmdrandom: 'random',
  cmdwiki: 'wiki',
  cmdweather: 'weather'
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
          } else if (x === 'cmdwiki') {
            str += '$' + commands[x] + ' [topic]' + '\n';
          } else if (x === 'cmdweather') {
            str += '$' + commands[x] + ' [location]' + '\n';
          } else {
            str += '$' + commands[x] + '\n';
          }
        }
		  	msg.channel.send(str);
			  break;
		  case commands.cmdmembers:
        let guildvar = client.guilds.fetch('768524986905526342').then(guild => msg.channel.send('There are ' + guild.memberCount + ' members online'));
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
      case commands.cmdwiki:
        const regexCom = /\$wiki /gm;
        const regexSpan = /<[\w=" /]+>/gm;
        const regexQuot = /&quot;*/gm;
        const regexAmpersand = /&amp;*/gm;
        const regexTrunc = /\..+/gm;
        let toSearch;
        toSearch = msg.content.replace(regexCom, '');
        toSearch = toSearch.replace(' ', "%20");
        https.get('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + toSearch + '&utf8=&format=json', (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            let tempResString = "";
            let parsedObj = JSON.parse(data);
            let objRes = parsedObj.query.search[0];
            if(objRes == undefined){
              msg.channel.send('I could not find any results for ' + toSearch);
              return;
            }
            let description;
            let newDesc;
            description = objRes.snippet;
            newDesc = description.replace(regexSpan, '')
            newDesc = newDesc.replace(regexQuot, '')
            newDesc = newDesc.replace(regexAmpersand, '&');
            newDesc = newDesc.replace(regexTrunc, '');
            tempResString += 'You searched for ' + objRes.title + "\n\n" + 'Result: ' + newDesc;
            msg.channel.send(tempResString);
          });
        }).on('error', (err) => {
          console.log('Error: ' + err.message);
        });
        break;
      case commands.cmdweather:
        let regexQMarks = /"/gm;
        let regexComWeather = /\$weather /gm;
        let locationToSearch;
        locationToSearch = msg.content.replace(regexComWeather, '');
        Weather.find({search: locationToSearch, degreeType: 'C'}, function(err, result) {
          if(err) console.log(err);
          if (result[0] === undefined) {
            msg.channel.send('Could not find the location you are looking for');
          } else {
            let currentLocation = JSON.stringify(result[0].location.name, null, 2);
            let currentLocationMod = currentLocation.replace(regexQMarks, '');
            let currentTemp = JSON.stringify(result[0].current.temperature, null, 2);
            let currentTempMod = currentTemp.replace(regexQMarks, '');
            let currentFeels = JSON.stringify(result[0].current.feelslike, null, 2);
            let currentFeelsMod = currentFeels.replace(regexQMarks, '');
            let currentHum = JSON.stringify(result[0].current.humidity, null, 2);
            let currentHumMod = currentHum.replace(regexQMarks, '');
            let currentSkyText = JSON.stringify(result[0].current.skytext, null, 2);
            let currentSkyTextMod = currentSkyText.replace(regexQMarks, '');
            let currentWindSpeed = JSON.stringify(result[0].current.windspeed, null, 2);
            let currentWindSpeedMod = currentWindSpeed.replace(regexQMarks, '');
            let weatherOutput = new Discord.MessageEmbed;
            weatherOutput.addField('Location', currentLocationMod, true);
            weatherOutput.addField('Temperature', currentTempMod, true);
            weatherOutput.addField('Feels like', currentFeelsMod, true);
            weatherOutput.addField('Humidity', currentHumMod + '%', true);
            weatherOutput.addField('Skytext', currentSkyTextMod, true);
            weatherOutput.addField('Wind speed', currentWindSpeedMod, true);
            msg.channel.send(weatherOutput);
          }
        });
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