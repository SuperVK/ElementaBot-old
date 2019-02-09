module.exports = {
    desc: 'Join a planet',
    aliases: ['guild', 'g'],
    run: async function(message, client, user) {
        switch(message.args[0]) {
            case 'invite': {
                if(message.args[1] == undefined || message.args[1].match(/\d{17,18}/) == undefined) return message.channel.createMessage('Tag the user you want to invite!')
                if(user.guild == null) return message.channel.createMessage(`You must be in a guild to do this!`)
                if(user.guild.owner != message.author.id) return message.channel.createMessage(`You must be the owner to do this!`)

                targetID = message.args[1].match(/\d{17,18}/)[0]
                client.guildInvitations.push({
                    guildID: user.guild.id,
                    userID: targetID
                })
                message.channel.createMessage(`<@${targetID}> you've been invited to **${user.guild.name}**, do \`.guild join\` to join! Invitation runs out in 60 seconds!`)
                setTimeout(async function() {
                    let index = client.guildInvitations.findIndex((i) => i.userID == targetID && i.guildID == user.guild.id)
                    if(index == -1) return
                    client.guildInvitations.splice(index, 1)
                    let disUser = await client.bot.getRESTUser(targetID)
                    message.channel.createMessage(`${disUser.username} didn't respond in time and the invite has been canceled!`)
                }, 60*1000)
                break;

            }
            case 'join': {
                let index = client.guildInvitations.findIndex(i => i.userID == message.author.id)
                let invite = client.guildInvitations[index]
                if(invite == undefined) return message.channel.createMessage(`You haven't been invited! Maybe it ran it out?`)
                client.guildInvitations.splice(index, 1)
                let guild = await client.getGuild(invite.guildID)
                guild.users.push(message.author.id)
                user.guild = guild
                message.channel.createMessage(`Successfully joined **${guild.name}**`)
                client.saveUser(user)
                client.saveGuild(guild)
                break;

            }
            case 'create': {
                if(message.args[1] == undefined) return message.channel.createMessage('You need to specify a name!')
                let name = message.content.substring(message.content.split(' ')[0].length + 1 + message.args[0].length + 1)
                client.createGuild(name, message.author.id)
                message.channel.createMessage(`Successfully created your guild!`)
                break;
            }
            default: {
                if(user.guild == null) return message.channel.createMessage(`You aren't in a guild yet, make one or join one!`)
                message.channel.createMessage(`**${user.guild.name}**`)
            }
        }
    }
}