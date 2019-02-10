module.exports = {
    desc: 'A place for viewing all the cards!',
    aliases: ['cards', 'card'],
    run: async function(message, client, user) {
        if(message.args[0] == undefined) {
            let msg = `**All the elements:**\n\n`
            let elements = Object.keys(client.elements)
            for(let element of elements) {
                msg += `> ${element}\n`
            }
            msg += `Do .cards *element* to get all the heroes in those elements`
            message.channel.createMessage(msg)
        } else if(message.args[1] == undefined) {
            let elements = Object.keys(client.elements)
            if(!elements.includes(message.args[0])) return message.channel.createMessage(`That's not an element...`)
            let heroes = Object.keys(client.elements[message.args[0]])
            let msg = `**All the heroes in ${message.args[0]}:**\n\n`
            for(let hero of heroes) {
                let heroName = client.elements[message.args[0]][hero].name
                msg += `> ${heroName}\n`
            }
            msg += `Do .cards ${message.args[0]} hero to get the hero in those elements`
            message.channel.createMessage(msg)
        } else {
            let elements = Object.keys(client.elements)
            if(!elements.includes(message.args[0])) return message.channel.createMessage(`That's not an element...`)
            let heroes = Object.keys(client.elements[message.args[0]])
            let heroName = message.args[1]
            if(message.args[2] != undefined) heroName += ' '+message.args[2]
            
            if(!heroes.includes(heroName)) return message.channel.createMessage(`That's not an hero...`)
            
            message.channel.createMessage({
                embed: {
                    title: client.elements[message.args[0]][heroName].name,
                    color: parseInt(client.elementColors[message.args[0]].substring(1), 16),
                    image: {
                        url: client.elements[message.args[0]][heroName].url
                    }
                }
            })
        }
    }
}