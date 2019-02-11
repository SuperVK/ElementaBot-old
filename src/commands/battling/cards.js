module.exports = {
    desc: 'A place for viewing all the cards!',
    aliases: ['cards', 'card'],
    run: async function(message, client, user) {
        if(message.args[0] == undefined) {
            let msg = `**All the elements:**\n\n`
            let elements = client.elements
            for(let element in elements) {
                msg += `> ${elements[element].name}\n`
            }
            msg += `Do .cards *element* to get all the heroes in those elements`
            message.channel.createMessage(msg)
        } else {
            let heroes = client.heroes.filter(el => {
                if(el.element.toLowerCase().startsWith(message.args[0]) && el.name.toLowerCase().startsWith(message.args[1])) return true
                if(el.name.toLowerCase().startsWith(message.args[0])) return true
                if(el.element.toLowerCase().startsWith(message.args[0]) && message.args[1] == undefined) return true
            })
            //check if all the heroes are from the same element
            if(heroes.length > 1 && heroes.filter(el => heroes[0].element == el.element).length == heroes.length) {
                let msg = `**All the heroes in ${heroes[0].element}:**\n\n`
                for(let hero of heroes) {
                    msg += `> ${hero.name}\n`
                }
                msg += `Do .cards hero to get the hero in those elements`
                message.channel.createMessage(msg)
            } else if(heroes.length != 0) {
                let hero = heroes[0]
                message.channel.createMessage({
                    embed: {
                        title: hero.name,
                        color: parseInt(client.elements[hero.element.toLowerCase()].color.substring(1), 16),
                        image: {
                            url: hero.url
                        }
                    }
                })
            } else {
                message.channel.createMessage(`I couldn't find that element or hero`)
            }
            
        }
    }
}