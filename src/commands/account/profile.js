module.exports = {

    desc: 'Displays your profile!',
    aliases: ['profile', 'account', 'p'],
    
    run: async function(message, client, user) {
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
Account created: ${new Date(user.signup_date).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}
        `)
        
    }
}