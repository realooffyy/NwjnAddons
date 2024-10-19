/**
 * ! Currently commented out because its current test code is considerably cheating
 */

// import MathUtil from "../../core/static/MathUtil"
// import EntityUtil from "../../core/static/EntityUtil"
// import RenderUtil from "../../core/static/RenderUtil"
// import Feature from "../../core/Feature"
// import EventEnums from "../../core/EventEnums"
// import { Event } from "../../core/Event"
// import { notify } from "../../core/static/TextUtil"
// import Settings from "../../data/Settings"

// const MOB_TYPES = ["monster", "passive", "boss"];
// export function getClassOfEntity(name, index = 0) {
//   try {
//     const clazz = Java.type(`net.minecraft.entity.${ MOB_TYPES[index] }.Entity${ name }`).class;

//     // recurses if #toString() throws error
//     clazz.toString()

//     return clazz;
//   } catch(err) {
//     if (index < MOB_TYPES.length) return getClassOfEntity(name, index + 1)

//     notify(`&cEntity class called &e'${name}'&r &cdoesn't exist. Make sure to use Mob Class Name not SkyBlock name. &3@see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries`)
//     return null;
//   }
// }

// let mobsHighlight = []
// /**
//  * @see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries
//  */
// function setMobHighlight() {
//   mobsHighlight = []
//   if (!Settings().mobList) return

//   Settings().mobList.split(/,\s?/g).forEach(entry => {
//     const [mob, hpParam] = entry.split("-")

//     // Check if entry is valid
//     if (!mob) return
//     const clazz = getClassOfEntity(mob)
//     if (!clazz) return

//     const hps = hpParam?.split("|")?.map(MathUtil.convertToNumber)

//     mobsHighlight.push([
//       clazz,
//       hps
//     ])
//   })
// }
// setMobHighlight()
// Settings().getConfig().onCloseGui(setMobHighlight)


// let renderThese = []
// const feat = new Feature("mobList")
//   .addEvent(
//     new Event(EventEnums.INTERVAL.FPS, () => {
//       renderThese = []
//       for (let arr of mobsHighlight) {
//         let [clazz, hps] = arr
//         renderThese.concat(
//           World.getAllEntitiesOfType(clazz).filter(it => 
//             !it.isDead() && (!hps || hps.includes(EntityUtil.getMaxHP(it)))
//           )
//         )
//       }

//       feat.update()
//     }, 2)
//   )
//   .addSubEvent(
//     new Event("renderWorld", () => {
//       const color = Settings().mobHighlightColor
//       for (let it of renderThese) {
//         RenderUtil.drawEntityBox(it.getRenderX(), it.getRenderY(), it.getRenderZ(), it.getWidth(), it.getHeight(), ...color, 2, true)
//       }
//     }),
//     () => renderThese.length
//   )
//   .onUnregister(() => 
//     renderThese = []
//   )