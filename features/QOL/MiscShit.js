import Feature from "../../core/Feature";
import Settings from "../../data/Settings";

/** @type {HashMap<Number: EntityTypeByte, (() => Boolean)|Boolean: always/never>} */
const blacklist = new HashMap()
Object.entries({
    1: true, // Boat,
    2: false, // Item (Dropped items & dungeon secrets)
    10: true, // MineCart
    50: () => Settings().removeTnt, // TntPrimed (SuperBoomTnt & T5 Phase 4)
    51: () => Settings().removeCrystals, // EnderCrystal (Ender Dragons & F/M7 Phase 1)
    60: () => Settings().removeArrows, // Arrow (Who's not shooting?)
    61: true, // Snowball
    62: true, // Egg
    63: () => Settings().removeFireballs, // Fireball
    64: () => Settings().removeFireballs, // SmallFireball
    66: () => Settings().removeWitherSkulls, // WitherSkull
    70: () => Settings().removeFallingBlocks, // FallingBlock
    71: false, // ItemFrame ("Why can't I do Tic-Tac-Toe")
    72: true, // EnderEye
    73: true, // Potion
    75: true, // ExpBottle
    77: true, // Leash
    78: false, // ArmorStand (LET ME CLICK EXPERIMENTATION TABLE)
    86: () => Settings().removeRockets, // Rocket
    90: false, // FishHook ("Is my rod out?")
    // Painting (Lovely separate packet)
    // ExpOrbs (Lovely separate packet)
}).forEach(([k, v]) => blacklist.put(k, v))

new Feature({setting: "miscShit"})
    .addEvent("spawnObject", (packet, event) => {
        const value = blacklist.get(packet.func_148993_l() /** entityTypeByte */)
        if (!value) return

        if (
            (typeof(value) === "function" && value())
            ||
            (typeof(value) === "boolean" && value)
        ) return cancel(event)
    })

    .addEvent("spawnPainting", cancel)
    .addEvent("spawnExp", cancel)