module.exports = {
    desc: 'Join a planet',
    aliases: ['guild', 'g'],
    run: function(message, client, user) {
        switch(message.args[0]) {
            case 'join': {
                
            }
            case 'create': {
                if(message.args[1] == undefined) return message.channel.createMessage('You need to specify a name!')
                client.createGuild()

            }
            default: {

            }
        }
    }
}