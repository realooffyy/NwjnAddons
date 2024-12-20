import Feature from "../../core/Feature";
import Settings from "../../data/Settings";

/** 
 * @see {https://github.com/Marcelektro/MCP-919/blob/1717f75902c6184a1ed1bfcd7880404aab4da503/src/minecraft/net/minecraft/entity/EntityTrackerEntry.java} ctrl-f S0EPacketSpawnObject
 * @type {HashMap<Number: EntityTypeByte, (() => Boolean)|Boolean: always/never>} 
 */
const blacklist = new HashMap()
Object.entries({
    1: true, // Boat,
    // 2: false, // Item (Dropped items & dungeon secrets)
    10: true, // MineCart
    50: () => Settings().removeTnt, // TntPrimed (SuperBoomTnt & T5 Phase 4)
    51: () => Settings().removeCrystals, // EnderCrystal (Ender Dragons & F/M7 Phase 1)
    60: () => Settings().removeArrows, // Arrow (Who's not shooting?)
    61: true, // Snowball
    62: true, // Egg
    63: () => Settings().removeFireballs, // Fireball
    64: () => Settings().removeFireballs, // SmallFireball
    66: () => Settings().removeWitherSkulls, // WitherSkull /** todo needs work */
    70: () => Settings().removeFallingBlocks, // FallingBlock
    // 71: false, // ItemFrame ("Why can't I do Tic-Tac-Toe")
    72: true, // EnderEye
    73: true, // Potion
    75: true, // ExpBottle
    76: () => Settings().removeRockets, // Rocket
    77: true, // Leash
    // 78: false, // ArmorStand (LET ME CLICK EXPERIMENTATION TABLE)
    // 90: false, // FishHook ("Is my rod out?")
}).forEach(([k, v]) => blacklist.put(k, v))

new Feature({setting: "miscShit"})
    .addEvent("spawnObject", (entityType, event) => {
        const value = blacklist.get(entityType)
        if (!value) return
        if (typeof(value) === "function" && !value()) return
        
        cancel(event)
    })

    .addEvent("spawnPainting", cancel)
    .addEvent("spawnExp", cancel)