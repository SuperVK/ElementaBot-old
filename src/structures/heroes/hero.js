/**
 * The base of the Hero
 * @prop {String} name The name of the hero
 * @prop {String} class The class of the hero
 * @prop {Object} stats The stats of the hero
 */

class Hero {
    /**
     * 
     * @param {String} name The name of the hero
     * @param {String} classType The class of the hero
     * @param {Number} stars The stars of the hero
     * @param {Object} stats The stats of the hero
     */
    constructor(name, classType, faction, stars, stats) {
        this.name = name

        this.class = classType

        this.faction = faction

        this.stars = stars

        this.stats = stats

        this.currentlyPlaying = false

    }

    /**
     * Attack an opponent
     * @param {Hero} enemy The enemy that will be atacked
     */
    attack(enemy) {
        enemy.health -= this.stats.attack
        return enemy
    }
    
}

module.exports = Hero