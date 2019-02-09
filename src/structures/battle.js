
const Heroes = require('./heroes/heroes.js')

class Battle {
    constructor(attacker, opponent, channelID, client, options) {
        this.options = {
            detailMode: 2
        }
        switch(options.detailMode) {
            case 1:
            case 'low':
                options.detailMode = 1
                break;
            case 2:
            case 'mid':
            case 'medium':
                options.detailMode = 2
                break;
            case 3:
            case 'high':
                options.detailMode = 3
                break;
            default:
                options.detailMode = 2
                break
        }
        
        if(typeof options == "object") {
            for(let property of Object.keys(options)) {
                this.options[property] = options[property];
            }
        }
        //this.options.detailMode--
        this.attacker = {
            joined: false,
            member: attacker,
            account: new User(client, attacker.id),
            //heroes: new User(client, member1.id).activeHeroes.sort((a,b) => b.speed-a.speed),
           
            heroIndex: -1
            
        }
        this.attacker.heroes = this.attacker.account.activeHeroes.sort((a,b) => b.speed-a.speed).map(h => new Heroes[h.name.toLowerCase()])
        this.opponent = {
            joined: false,
            member: opponent,
            account: new User(client, opponent.id),
            //heroes: new User(client, member1.id).activeHeroes.sort((a,b) => b.speed-a.speed),
            
            heroIndex: -1
            
        }
        this.turn = 'attacker'
        this.opponent.heroes = this.opponent.account.activeHeroes.sort((a,b) => b.speed-a.speed).map(h => new Heroes[h.name.toLowerCase()])
        this.channelID = channelID
        // let vsEmoji = client.bot.getChannel(channelID).guild.emojis.find(em => em.name.toLowerCase() == 'versus')
        // this.msg = `${this.attacker.member.username} <:${vsEmoji.name}:${vsEmoji.id}> ${this.opponent.member.username}` + '```diff\n'
        this.msg = ``
        this.client = client
        this.round = 0
        this.isOver = false
        this.nextRound()
    }
    nextRound() {
        this.round++
        this.fight(this.turn)
        if(this.turn == 'attacker') this.turn = 'opponent'
        else this.turn = 'attacker'
        if(!this.isOver) this.nextRound()
    }
    fight(side) {
        let opposite = ('attacker' == side) ? 'opponent' : 'attacker'
        let posNeg = ('attacker' == side) ? '+' : '-'
        this[side].heroIndex++
        
        //reset the heroIndex if it hit the end of the line
        if(this[side].heroIndex == this[side].heroes.length) this[side].heroIndex = 0
        let sideHero = this[side].heroes[this[side].heroIndex]
        let oppHero = this[opposite].heroes[0]

        oppHero.stats.health -= sideHero.stats.attack
        if(this.options.detailMode == 3) {
            this.msg += '\n'
            this.msg += `${posNeg} ${this[side].member.username}'s ${sideHero.name} did ${sideHero.stats.attack} damage to ${oppHero.name}. (${oppHero.stats.health} HP left)\n`
        }
        if(oppHero.stats.health <= 0) {
            
            if(this.options.detailMode >= 2) {
                if(this.options.detailMode != 3) this.msg += '\n'
                this.msg += `${posNeg} ${this[opposite].member.username}'s ${oppHero.name} has been killed\n`
            }
            this[opposite].heroes.splice(0,1)
            if(this[opposite].heroIndex != 0) this[opposite].heroIndex--
        }
        
        if(this[opposite].heroes.length === 0) {
            this.msg += `${posNeg} ${this[side].member.username} won and gained 50 gold!`
            this[side].account.balance += 50
            this[side].account.save()
            
            this.isOver = true
            this.sendMsg()
            return
        }

    }
    
    
    sendMsg() {
        //this.msg.edit(msg)
        let lines = this.msg.split('\n')
        let chars = 0
        let i = 0
        let msgs = ['']
        let vsEmoji = this.client.bot.getChannel(this.channelID).guild.emojis.find(em => em.name.toLowerCase() == 'versus')
        for(let line of lines) {
            if((chars + line.length) >= 1900) {
                i++
                msgs[i] = ''
                chars = 0
            }
            chars += line.length
            msgs[i] += line + '\n'
        }
        for(let i in msgs) {
            
            msgs[i] = '```diff\n' + msgs[i] + '```'
            if(i == 0) msgs[i] = `${this.attacker.member.username} <:${vsEmoji.name}:${vsEmoji.id}> ${this.opponent.member.username}` + msgs[i]
            this.client.bot.createMessage(this.channelID, msgs[i])
        }
        
    }
    getPlayer() {
        if(this.round%2) return this.opponent
        else return this.attacker
    }
}
module.exports = Battle