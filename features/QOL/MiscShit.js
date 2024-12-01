import Feature from "../../core/Feature";

/** @type {Set<Number>} of EntityTypeBytes*/
const blacklist = new Set([
    1, // Boat
    // 2, // Item (Dropped items & dungeon secrets)
    10, // MineCart
    // 50, // TntPrimed (SuperBoomTnt & T5 Phase 4)
    // 51, // EnderCrystal (Ender Dragons & F/M7 Phase 1)
    // 60, // Arrow (Who's trolling)
    61, // Snowball
    62, // Egg
    63, // Fireball
    64, // SmallFireball
    66, // WitherSkull
    70, // FallingBlock
    // 71, // ItemFrame ("Why can't I do Tic-Tac-Toe")
    72, // EnderEye
    73, // Potion
    75, // ExpBottle
    77, // Leash
    // 78, // ArmorStand (LET ME CLICK EXPERIMENTATION TABLE)
    86, // Rocket
    // 90, // FishHook ("Is my rod out?")
])

new Feature({setting: "miscShit"})
    .addEvent("spawnObject", (packet, event) => {
        if (blacklist.has(packet.func_148993_l() /** entityTypeByte */)) cancel(event)
    })

    .addEvent("spawnPainting", cancel)
    .addEvent("spawnExp", cancel)