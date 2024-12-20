export default class EntityUtil {
    /**
     * @param {MCTEntity|Entity} entity 
     * @returns {MCTEntity} the mcEntity
     */
    static getEntity = (entity) => entity?.entity ?? entity

    /**
     * Credit: PerseusPotter
     * Gets the Max HP of the entity
     * @param {MCTEntity|Entity} entity 
     * @returns {?Number} maxhealth int
     */
    static getMaxHP = (entity) => ~~entity.entity?.func_110140_aT()?.func_111152_a('generic.maxHealth')?.func_111125_b()

    /**
     * Gets the current HP of the entity
     * @param {MCTEntity|Entity} entity 
     * @returns {?Number} hp int
     */
    static getHP = (entity) => ~~EntityUtil.getEntity(entity)
        ?.func_110143_aJ() // getHealth

    /**
     * Checks if the player entity is a real user
     * @param {PlayerMP} player 
     * @returns {Boolean}
     */
    static isRealPlayer = (player) => player.getPing() === 1
}