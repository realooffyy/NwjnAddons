import Feature from "../../core/Feature";
import { scheduleTask, secondsToTick } from "../../utils/Ticker";
import RenderUtil from "../../core/static/RenderUtil";
import TextUtil from "../../core/static/TextUtil";
import { data } from "../../data/Data";
import Settings from "../../data/Settings";

/**
 * Adapted chat waypoint regex from DocilElm
 * @author DocilElm
 * @credit https://github.com/DocilElm/Doc/blob/main/features/misc/ChatWaypoint.js#L10
 */
const ChatWaypointSentRegex = /^(?:[\w\-]{5} > )?(?:\[\d{1,3}\] .? ?)?(?:\[\w+\+*\] )?(\w{1,16})(?: .? ?)?: x: (-?[\d\.]+), y: (-?[\d\.]+), z: (-?[\d\.]+) ?(.+)?$/

/** @type {Map<String, Object>} */
const waypoints = new Map()

const feat = new Feature({setting: "waypoint"})
    .addEvent("serverChat", (displayName, x, y, z, text = "", event, formatted) => {
        const ign = TextUtil.getSenderName(displayName).toLowerCase()
        
        if (data.blacklist.includes(ign)) return TextUtil.append(event.func_148915_c(), "§cBlacklisted")
        
        const [title] = TextUtil.getMatches(/^(.+)§.:/, formatted)

        const wp = {
            title,
            text: text.trim() && `\n${text}`,
            coord: [~~x - 0.5, ~~y, ~~z - 0.5],
            dist: ~~Player.asPlayerMP().distanceTo(~~x - 0.5, ~~y, ~~z - 0.5),
            dur: secondsToTick(Settings().wpTime)
        }

        waypoints.set(ign, wp)
        feat.registerSubsOnly()
    }, ChatWaypointSentRegex)

    .addSubEvent("serverTick", () => {
        if (!waypoints.size) feat.unregisterSubsOnly()

        waypoints.forEach(it => {
            const dist = it.dist = ~~Player.asPlayerMP().distanceTo(...it.coord)
            const dur = it.dur--

            if (dur <= 0 || dist <= 5) it.dirty = true
        })
    })

    .addSubEvent("renderWorld", () => {
        const [r, g, b, a] = Settings().wpColor
        waypoints.forEach((it, ign) => {
            if (it.dirty) return waypoints.delete(ign)

            RenderUtil.renderWaypoint(`${ it.title } §b[${ it.dist }m]${it.text}`, ...it.coord, r, g, b, a, true)
        })
    })

import { addCommand } from "../../utils/Command"
addCommand("clearWaypoints", "Stops rendering current waypoints", () => {
    waypoints.clear()
    feat.unregisterSubsOnly()
})