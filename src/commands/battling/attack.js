const Battle = require('../../structures/battle.js')

module.exports = {
    desc: 'Attack some thicc as boiii',
    aliases: ['attack', 'att'],
    run: async function(message, args, client, user) {
        let opponent = message.mentions[0]
        
        if(opponent == undefined) return message.channel.createMessage('Who do you want to attack?')
        if(user.inventory.tickets <= 0) return message.channel.createMessage(`You don't have enough tickets to fight!`)
        let options = {
            detailMode: user.detailMode
        }
        let matches = message.content.match(/-\S{0,}/g)
        if(matches) {
            let detailMode = matches.find(e => e.toLowerCase().includes('details'))
            if(detailMode != undefined) options.detailMode = detailMode.split('=')[1].toLowerCase()
        }
        user.inventory.tickets--
        new Battle(message.member, opponent, message.channel.id, client, options)
        user.save()
    }
}