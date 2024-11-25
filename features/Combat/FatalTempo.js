// import { addCountdown, secondsToTick } from "../../utils/Ticker"
// import Settings from "../../data/Settings"
// import Location from "../../utils/Location"
// import ItemUtil from "../../core/static/ItemUtil"
// import Feature from "../../core/Feature"
// import EventEnums from "../../core/EventEnums"
// import { Event } from "../../core/Event"
// import DraggableGui from "../../utils/DraggableGui"

// const overlay = new DraggableGui({
//     name: "FatalTempo",
//     setting: "fatalTempo",
//     example: "Fatal Tempo:&c   0% | 0.00s",
//     command: "nwjnFatalTempo"
// })
// const OPTION = {
//     "ALWAYS": 1,
//     "OVER_0": 2,
//     "AT_200": 3
// }

// let percent, buffLeft, ftLevel, inKuudra; reset()
// function reset() {
//     percent = 0
//     buffLeft = 0
//     ftLevel = 0
//     inKuudra = false
//     overlay.drawText(formatText())
// }

// const feat = new Feature({setting: "fatalTempo"})
//     .addEvent(
//         new Event(EventEnums.CLIENT.HELDITEMCHANGE, () => {
//             const holding = Player.getHeldItem()
//             if (holding?.getRegistryName() !== "minecraft:bow") return

//             const ftLvl = ItemUtil.getExtraAttribute(holding)?.enchantments?.ultimate_fatal_tempo
//             if (!ftLvl) return

//             ftLevel = ftLvl
//             inKuudra = Location.inWorld("Kuudra")
//             feat.update()
//         })
//     )
//     .addSubEvent(
//         // hypixel doesnt send 'random.successful_hit' in kuudra
//         new Event(EventEnums.CLIENT.SOUNDPLAY, addHit, "tile.piston.out"),
//         () => inKuudra
//     )
//     .addSubEvent(
//         new Event(EventEnums.CLIENT.SOUNDPLAY, addHit, "random.successful_hit"),
//         () => !inKuudra
//     )
//     .onUnregister(reset)

// function formatText() {
//     buffLeft = MathLib.clampFloat(buffLeft, 0, 3)
//     percent = MathLib.clamp(percent, 0, 200)
//     if (!shouldDraw()) return ""

//     const parts = []
//     if (Settings().ftPrefix) 
//         parts.push("Fatal Tempo: ")

//     if (Settings().ftPercent) {
//         const color = 
//             percent === 200 ? "&a" :
//             percent > 0 ? "&e" :
//         "&c"
//         parts.push(`${color}${percent}%`)
//     }
    
//     if (Settings().ftPercent && Settings().ftTime)
//         parts.push(" &r| ")

//     if (Settings().ftTime) {
//         const color = 
//             buffLeft > 1.25 ? "&a" :
//             buffLeft > 0 ? "&e" :
//         "&c"
//         parts.push(`${color}${buffLeft.toFixed(2)}s`)
//     }

//     return parts.join(" ")
// }

// function addHit() {
//     percent += ftLevel * 10
//     addCountdown((remainder) => {
//         if (!remainder) return reset()
//         buffLeft = remainder

//         overlay.drawText(formatText())
//     }, secondsToTick(3))
// }

// function shouldDraw() {
//     switch (Settings().fatalTempo) {
//         case OPTION.ALWAYS: return true
//         case OPTION.OVER_0 && percent > 0: return true
//         case OPTION.AT_200 && percent === 200: return true
//         default: return false
//     }
// }