const Discord = require('discord.js');
module.exports = {
	name: 'setup',
	description: 'Ping!',
	execute(message) {
        message.guild.channels.create('resources', {
            type: "text",
            topic: "Use this channel for posting any resources you may need for the project."
        }).then( channel => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Resources')
                .setDescription('Use this channel for posting any resources you may need for the project.')
                .setThumbnail(`https://thumbs.dreamstime.com/b/resources-icon-vector-isolated-white-background-sign-line-outline-elements-linear-style-transparent-134157064.jpg`);
            channel.send(embed);
        })
        
        message.guild.channels.create('ideas', {
            type: "text",
            topic: "Use this channel for posting any resources you may need for the project."
        }).then( channel => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Resources')
                .setDescription('Use this channel for posting any ideas for the project.')
                .setThumbnail(`https://pyxis.nymag.com/v1/imgs/264/592/dcddc7b4bf91c55b093ac26a9bf3bebe90-10-smart-lightbulb.rsquare.w700.jpg`);
            channel.send(embed);
        })

        message.guild.channels.create('github-updates', {
            type: "text",
            topic: "This channel is used to receive Github notifications from the bot."
        }).then( channel => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Github Updates')
                .setDescription('This channel is used to receive Github notifications from the bot.')
                .setThumbnail(`https://github.githubassets.com/images/modules/open_graph/github-mark.png`);
            channel.send(embed);
        })
        
        message.guild.channels.create('trello-updates', {
            type: "text",
            topic: "This channel is used to receive Trello board updates from the bot."
        }).then( channel => {
            const embed = new Discord.MessageEmbed()
                .setTitle('Resources')
                .setDescription('Use this channel for posting any ideas for the project.')
                .setThumbnail(`https://pyxis.nymag.com/v1/imgs/264/592/dcddc7b4bf91c55b093ac26a9bf3bebe90-10-smart-lightbulb.rsquare.w700.jpg`);
            channel.send(embed);
        })
	},
};