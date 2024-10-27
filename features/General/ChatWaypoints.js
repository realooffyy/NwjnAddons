import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import EventEnums from "../../core/EventEnums";
import { scheduleTask, secondsToTick } from "../../utils/Ticker";
import RenderUtil from "../../core/static/RenderUtil";
import TextUtil from "../../core/static/TextUtil";
import { data } from "../../data/Data";
import { addCommand } from "../../utils/Command";

/**
 * Adapted chat waypoint regex from DocilElm
 * @author DocilElm
 * @credit https://github.com/DocilElm/Doc/blob/main/features/misc/ChatWaypoint.js#L10
 */
const ChatWaypointSentRegex = 
/^(?:[\w\-]{5} > )?(?:\[\d{1,3}\] .? ?)?(?:\[\w+\+*\] )?(\w{1,16})(?: .? ?)?: x: (-?[\d\.]+), y: (-?[\d\.]+), z: (-?[\d\.]+) ?(.+)?$/

/** @type {Map<String, [String, Number, Number, Number, String?]>} */
const waypoints = new Map()

const feat = new Feature({
  setting: "waypoint",
  otherSettings: ["wpTime", "wpColor"]
})
  .addEvent(
    new Event(EventEnums.SERVER.CHAT, (displayName, x, y, z, text = "", event, formatted) => {
      const ign = TextUtil.getSenderName(displayName).toLowerCase()
      
      if (data.blacklist.includes(ign)) return TextUtil.append(event.func_148915_c(), "§cBlacklisted")
        
        const [title] = TextUtil.getMatches(/(.+):/, formatted)

        const wp = [title, ~~x, ~~y, ~~z]
        if (text.trim()) wp.push(`\n${text}`)

        waypoints.set(ign, wp)
        feat.update()
        
        scheduleTask(() => {
          waypoints.delete(ign)
          feat.update()
        }, secondsToTick(feat.wpTimeValue))
    }, ChatWaypointSentRegex)
  )
  .addSubEvent(
    new Event("renderWorld", () => {
      waypoints.forEach(([title, x, y, z, text = ""]) => {
        const distance = ~~Player.asPlayerMP().distanceTo(x, y, z)

        RenderUtil.renderWaypoint(`${ title } §b[${ distance }m]${text}`, x, y, z, ...feat.wpColorValue, true)
      })
    }),
    () => waypoints.size
  )
  .onUnregister(() => waypoints.clear())

addCommand("clearWaypoints", "Stops rendering current waypoints", () => {
  waypoints.clear()
  feat.update()
})