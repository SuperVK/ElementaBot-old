module.exports = {

    desc: 'Displays your profile!',
    aliases: ['profile', 'account', 'p'],
    
    run: async function(message, client, user) {
        if(message.args[0] == 'setelement') {
            if(message.args[1] == undefined) return message.channel.createMessage(`Usage: .profile setelement elementname`)
            let element = client.elements.find(el => el.name.toLowerCase().startsWith(message.args[1]))
            if(element == undefined) return message.channel.createMessage(`That element doesn't exist!`)
            user.element = element.name
            client.saveUser(user)
            message.channel.createMessage(`Succesfully joined ${element.name}!`)
            return
        }
        let targetID;
        if(message.args[0] != undefined && message.args[0].match(/\d{17,18}/) != null) {
            targetID = message.args[0].match(/\d{17,18}/)[0]
            
            
            
            if(user == null) return message.channel.createMessage(`This person doesn't have a profile!`)
        } else {
            targetID = message.author.id
        }
        
        user = await client.getUser(targetID, true)
        let disUser = await client.bot.getRESTUser(targetID)
        message.channel.createMessage(`The profile of **${disUser.username}**
Gold: ${user.balance} <:gold:543746706630639617>
Guild: ${user.guild ?  user.guild.name : 'None'}
Element: ${user.element ?  user.element : 'None'}
Account created: ${new Date(user.signup_date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}
        `)
        
    }
}