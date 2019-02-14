module.exports = {
    desc: 'Check the bag that contains all your heroes!',
    aliases: ['bag'],
    run: async function(message, client, user) {
        let heroes = client.heroes.filter(h => h.pack == user.element)
        let msg = `**Here are all your cards:**\n\n`
        for(let hero of heroes) {
            msg += `> ${hero.name}\n`
        }
        message.channel.createMessage(msg)
    }
}