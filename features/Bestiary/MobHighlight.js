/**
 * ! Currently commented out because its current test code is considerably cheating
 */

import MathUtil from "../../core/static/MathUtil"
import EntityUtil from "../../core/static/EntityUtil"
import RenderUtil from "../../core/static/RenderUtil"
import Feature from "../../core/Feature"
import { notify } from "../../core/static/TextUtil"
import Settings from "../../data/Settings"

const MOB_TYPES = ["monster", "passive", "boss"];
function getClassOfEntity(name, index = 0) {
    try {
        const clazz = Java.type(`net.minecraft.entity.${ MOB_TYPES[index] }.Entity${ name }`).class;
        // recurses if #toString() throws error
        clazz.toString()

        return clazz;
    } catch(err) {
        if (index < MOB_TYPES.length) return getClassOfEntity(name, index + 1)

        notify(`&cEntity class called &e'${name}'&r &cdoesn't exist. Make sure to use Mob Class Name not SkyBlock name. &3@see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries`)
        return null;
    }
}

// change to weakhashmap
const mobsHighlight = new java.util.WeakHashMap()
const renderThese = new java.util.WeakHashMap()
/**
 * @see https://github.com/nwjn/NwjnAddons/wiki/Bestiary-Entries
 */
function setMobHighlight() {
    mobsHighlight.clear()
    renderThese.clear()
    if (!Settings().mobList) return

    Settings().mobList.split(/,\s?/g).forEach(entry => {
        const [mob, hpParam] = entry.split("-")

        // Check if entry is valid
        if (!mob) return
        const clazz = getClassOfEntity(mob)
        if (!clazz) return

        const hps = hpParam?.split("|")?.map(MathUtil.convertToNumber) ?? 0

        mobsHighlight.put(
            clazz,
            hps
        )
    })
}
setMobHighlight()
Settings().getConfig().onCloseGui(setMobHighlight)


const feat = new Feature({setting: "mobList"})
    .addEvent("interval", () => {
        renderThese.clear()
        mobsHighlight.forEach((clazz, hps) => {
            World.getAllEntitiesOfType(clazz).forEach(it => {
                if (it.isDead()) return
                if (!hps || hps?.includes(EntityUtil.getMaxHP(it))) renderThese.put(it, [it.getWidth(), it.getHeight()])
            })
        })

        feat.update()
    }, 1 / 3)

    .addSubEvent("renderWorld", () => {
        const color = Settings().mobHighlightColor
        renderThese.forEach((it, [w, h]) => 
            RenderUtil.drawOutlinedBox(it.getRenderX(), it.getRenderY(), it.getRenderZ(), w, h, color[0], color[1], color[2], color[3], true, 2)
        )
    }, () => !renderThese.isEmpty())

    .onUnregister(() => renderThese.clear())
