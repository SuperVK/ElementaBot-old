const Eris = require('eris')
const fs = require('fs')
const mariadb = require('mariadb')
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

        this.dbConn = null

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
    /**
     * Starts the bot
     */
    async start() {
        
        this.loadCommands()
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
        return res[0]

    }

    async createUser(id) {
        await this.dbConn.query('INSERT INTO users VALUES (?, ?, ?, ?)', [id, 50, new Date()-0, null])
        let res = await this.dbConn.query('SELECT * FROM users WHERE id=?', [id])
        return res[0]
    }

    async saveUser(user) {
        this.dbConn.query('UPDATE users SET balance=? WHERE id=?', [user.balance, user.id])
    }

    async createGuild(name, ownerID) {
        let id = this._generateRandomCode()
        this.dbConn.query('INSERT INTO guilds VALUES (?, ?, ?, ?, ?)', [name, JSON.stringify([ownerID]), this._generateRandomCode(), 50, ownerID])
        this.dbConn.query('UPDATE users SET guild=? WHERE id=?', [id, ownerID])
    }

    async getGuild(id) {
        let res = await this.dbConn.query('SELECT * FROM guilds WHERE id=?', [id])
        if(res.length == 0) {
            return null
        }
        return res[0]

    }

    async saveGuild(user) {
        this.dbConn.query('UPDATE users SET balance=? WHERE id=?', [user.balance, user.id])
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