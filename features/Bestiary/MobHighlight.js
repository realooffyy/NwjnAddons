import settings from "../../config"
import RenderLib from "RenderLib"
import { data } from "../../utils/data";
import { Overlay } from "../../utils/overlay";
import { registerWhen, getRGB1, getMaxHP } from "../../utils/functions";
import { PREFIX } from "../../utils/constants";

// TODO (ADD): if ~ instead of - then % the entry hp and see if r = 0
// TODO (FIX): CURRENTLY ARMOR STANDS DONT TAKE SPACES IN ENTRY
// TODO (ADD): Command to add mob to settings.rawmoblist
// TODO (ADD): add support for entity.boss
// TODO (CHANGE): on overlay show the health aswell so that multiple health entries of the same mobtype aren't combined
export function setMobHighlight() {
  let mobsHighlight = {}
  if (!settings.rawMobList) {
    data.mobsHighlight = mobsHighlight
    data.save()
    return
  }
  /*
     * Raw entry in form:
     * `<Mob>(-\d[kKmMbB]?(|\d[kKmMbB]?)+)?`
     *    ^   ^            ^ Delimiter between each health value
     *    |   |- Delimiter between monster & health value(s)
     *    |- A monster from net.minecraft.entity.monster or net.minecraft.entity.passive
  */
  const mobList = settings.rawMobList.split(",")
  let i = mobList.length
  while (i--) {
    const [entryMob, hpsRaw] = mobList[i].split("-", 2)

    const mob = getClassOfEntity(entryMob)
    if (!mob) return

    const hps = hpsRaw?.split("|")?.map(hpRaw => {
      let hp = parseFloat(hpRaw.match(/[\d\.]+/g))

      if (hpRaw.match(/k/gi)) hp *= 1_000
      if (hpRaw.match(/m/gi)) hp *= 1_000_000
      if (hpRaw.match(/b/gi)) hp *= 1_000_000_000

      return hp;
    })
    mobsHighlight = {
      ...mobsHighlight,
      [mob]: hps
    }
  }
  data.mobsHighlight = mobsHighlight
  data.save()
}

const MOB_TYPES = ["monster", "passive", "boss"];
function getClassOfEntity(entity, index = 0) {
  try {
    const packageName = `net.minecraft.entity.${ MOB_TYPES[index] }.Entity${ entity }`
    const mobClass = Java.type(packageName).class;

    // recurses if mobClass.toString() throws error
    const testClass = mobClass.toString()
    return packageName.replace(/\./g, "_");
  } catch(err) {
    if (index < MOB_TYPES.length) return getClassOfEntity(entity, index + 1)

    ChatLib.chat(`${PREFIX}: &cEntity called &e'${entity}' &cdoesn't exist.`)
    return false;
  }
}

const mobCountExample = `&eZombie: 0`
export const mobCountOverlay = new Overlay("mobEspCount", ["all"], () => true, data.mobCountL, "moveCount", mobCountExample);
mobCountOverlay.setMessage("")

registerWhen(register("renderWorld", () => {
  const entries = Object.entries(data.mobsHighlight)
  let i = entries.length
  while (i--) {
    const entityClass = entries[i][0].replace(/_/g, ".")
    const hps = entries[i][1]

    const entities = World.getAllEntitiesOfType(Java.type(entityClass).class).filter(e => !e.isInvisible() && !e.isDead() && Player.asPlayerMP().canSeeEntity(e) && (hps && hps.includes(getMaxHP(e))))
    let ii = entities.length
    while (ii--) {
      const entity = entities[ii];
      RenderLib.drawEspBox(entity.getRenderX(), entity.getRenderY(), entity.getRenderZ(), entity.getWidth(), entity.getHeight(), ...getRGB1(settings.espColor), 1, false)
    }
    const className = entityClass.split("Entity").slice(-1)
    const TEMPLATE = `${ className }: ${ entities.length }\n`

    let currMessage = mobCountOverlay.message
    const txt = currMessage.includes(className) ? currMessage.replace(new RegExp(`(${ className }: [0-9]+\n|&eZombie: 0)`), TEMPLATE) : currMessage + TEMPLATE
    mobCountOverlay.setMessage(txt)
  }
}), () => data.mobsHighlight != "")