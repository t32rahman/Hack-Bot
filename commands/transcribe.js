const fs = require('fs');
const createNewChunk = () => {
    const pathToFile = __dirname + `./recordings/${Date.now()}.pcm`;
    return fs.createWriteStream(pathToFile);
};

module.exports = {
	name: 'transcribe',
	description: 'Transcribes vc meeting',
	execute(message, args) {
		const { voice } = message.member;
        if (!voice.channelID) {
            message.reply('you must be in a voice channel.');
            return;
        }
 
        voice.channel.join().then((connection) => {
            

            const receiver = connection.receiver;
            connection.on('speaking', (user, speaking) => {
                if (speaking) {
                    console.log(`${user.username} started speaking`);
                    const audioStream = receiver.createStream(user, {mode:'pcm'});
                    console.log(audioStream.pipe(createNewChunk()));
                    audioStream.on('end', () => { console.log(`${user.username} stopped speaking`); });
                }
            })
        });
	},
};
