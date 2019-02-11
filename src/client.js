const Eris = require('eris')
const fs = require('fs')
const mariadb = require('mariadb')
const path = require('path')
const events = require('./events.js')

/** 
* EW client
* @prop {Eris} bot the Eris bot that connects to discord
* @prop {String} prefix the prefix of the bot
* @prop {Array} commands all of the commands
*/



class Client {
    /**
     * Creates the EW client
     * @param {String} token The bot's token
     * @param {String} prefix The prefix of the bot
     */
    constructor(prefix, discmds, ids) {
        this.bot = new Eris(process.env.TOKEN, {restMode: true})

        this.prefix = prefix

        this.commands = []

        this.discmds = discmds

        this.users = []

        this.heroes = []
        this.elements = require(path.join(__dirname, '../data/elements.json'))

        this.dbConn = null

        this.guildData = {
            invitations: [],
            deleteRequests: []
        }

        this.playerRoleID = ids.playerRole
        this.ownerID = ids.owner
        this.adminRoleID = ids.adminRole
    }
    /**
     * Loads all the avaible commands into this.commands
     */
    loadCommands() {
        var categories = fs.readdirSync(__dirname + '/commands')
        for(var i in categories) {
            var category = categories[i]
            var commands = fs.readdirSync( __dirname + '/commands/' + category)
            for(var j in commands) {
                var command = commands[j]
                this.commands.push(require(`${__dirname}/commands/${category}/${command}`))
            }
        }
    }

    loadHeroes() {
        var elements = fs.readdirSync(path.join(__dirname, '/../data'))
        for(let element of elements) {
            if(element.includes('.')) continue
            let heroes = fs.readdirSync(path.join(__dirname, `/../data/${element}`))
            
            for(let hero of heroes) {
                if(!hero.includes('.')) continue
                let heroName = hero.split('.')[0].replace('_', ' ').replace('-', '.').toLowerCase()
                this.heroes.push(require(path.join(__dirname, `/../data/${element}/${hero}`)))
            }
        }
    }
    /**
     * Starts the bot
     */
    async start() {
        
        this.loadCommands()
        this.loadHeroes()
        this.bot.on('ready', () => console.log('Ready!'))
        this.bot.on('error', console.error)
        this.bot.on('messageCreate', (message) => {
            events.createMessage(message, this)
        })

        this.dbConn = await mariadb.createConnection({host: process.env.DATABASE_HOST, user: process.env.DATABASE_USER, password: process.env.DATABASE_PASSWORD, database: 'ElementalWars'})
        
        this.bot.connect()
    }

    async getUser(id, noInsert) {
        let res = await this.dbConn.query('SELECT * FROM users WHERE id=?', [id])
        if(res.length == 0) return null
        let user = res[0]
        if(user.guild != null) {
            //convert guild ID to actual guild object
            user.guild = await this.getGuild(user.guild)
        }
        return res[0]

    }

    async createUser(id) {
        await this.dbConn.query('INSERT INTO users VALUES (?, ?, ?, ?)', [id, 50, new Date()-0, null])
        let res = await this.dbConn.query('SELECT * FROM users WHERE id=?', [id])
        return res[0]
    }

    async saveUser(user) {
        if(user.guild != null) user.guild = user.guild.id
        else user.guild = null
        this.dbConn.query('UPDATE users SET balance=?, guild=? WHERE id=?', [user.balance, user.guild, user.id])
    }

    async createGuild(name, ownerID, roleID) {
        let id = this._generateRandomCode()
        this.dbConn.query('INSERT INTO guilds VALUES (?, ?, ?, ?, ?, ?)', [name, JSON.stringify([ownerID]), id, 50, ownerID, roleID])
        this.dbConn.query('UPDATE users SET guild=? WHERE id=?', [id, ownerID])
    }

    async getGuild(id) {
        let res = await this.dbConn.query('SELECT * FROM guilds WHERE id=?', [id])
        if(res.length == 0) {
            return null
        }
        let guild = res[0]
        guild.members = JSON.parse(guild.members)
        return res[0]

    }

    deleteGuild(id) {
        this.dbConn.query('DELETE FROM guilds WHERE id=?', [id])
    }

    async saveGuild(guild) {
        this.dbConn.query('UPDATE guilds SET balance=?, members=? WHERE id=?', [guild.balance, JSON.stringify(guild.members), guild.id])
    }

    _generateRandomCode() {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        let token = ''
        for(let i=0;i<10;i++) {
        token += chars[Math.round(Math.random()*chars.length)]
        }
        return token
    }

    
}

module.exports = Client