const Hero = require('./hero')

class Sheera extends Hero {
    constructor() {
        super('Sheera', 'Healer', 'Forest', 5, {
            health: 25000,
            attack: 2500,
            speed: 630
        })

    }
    
}

class Vicky extends Hero {
    constructor() {
        super('Vicky', 'Ranger', 'Elion', 5, {
            health: 12000,
            attack: 4000,
            speed: 615
        })
    }
}

class Elion extends Hero {
    constructor() {
        super('Elion', 'Ranger', 'Forest', 5, {
            health: 12000,
            attack: 4000,
            speed: 615
        })
    }
}

class Zyra extends Hero {
    constructor() {
        super('Zyra', 'Support', 'Forest', 5, {
            health: 20000,
            attack: 3000,
            speed: 640
        })
    }
}

class Jeanne extends Hero {
    constructor() {
        super('Jeanna', 'Mage', 'Forest', 2, {
            health: 1800,
            attack: 400,
            speed: 280
        })
    }
}

class Ryrlith extends Hero {
    constructor() {
        super('Ryrlith', 'Mage', 'Hell', 1, {
            health: 900,
            attack: 300,
            speed: 200
        })
    }
}

module.exports = {
    sheera: Sheera,
    vicky: Vicky,
    elion: Elion,
    zyra: Zyra,
    jeanne: Jeanne,
    ryrlith: Ryrlith
}