import Feature from "../../core/Feature";
import RenderUtil from "../../core/static/RenderUtil";
import TextUtil from "../../core/static/TextUtil";
import { data } from "../../data/Data";
import Settings from "../../data/Settings";
import { scheduleTask } from "../../libs/Time/ServerTime";
import Second from "../../libs/Time/Second";

/** @type {Map<String, Waypoint>} */
const waypoints = new Map()

const ChatWaypoints = new Feature({setting: "waypoint"})
    .addEvent("serverChat", (displayName, x, y, z, text = "", event, formatted) => {
        const ign = TextUtil.getSenderName(displayName).toLowerCase()
        
        if (data.blacklist.includes(ign)) return TextUtil.append(event.func_148915_c(), "§cBlacklisted")
        
        const [title] = TextUtil.getMatches(/^(.+)§.:/, formatted)

        new Waypoint(ign, title, x, y, z, text)
    }, /^(?:[\w\-]{5} > )?(?:\[\d{1,3}\] .? ?)?(?:\[\w+\+*\] )?(\w{1,16})(?: .? ?)?: x: (-?[\d\.]+), y: (-?[\d\.]+), z: (-?[\d\.]+) ?(.+)?$/)

    .addSubEvent("tick", () => {
        if (!World.isLoaded()) return
        waypoints.forEach(it => it.updateRenderable())
    })

    .addSubEvent("renderWorld", () => {
        const [r, g, b, a] = Settings().wpColor
        waypoints.forEach(it => {
            const {x, y, z} = it.loc
            /** todo: isboundingboxinfrustrum */
            RenderUtil.renderWaypoint(it.text, x, y, z, r, g, b, a, true)
        })
    })

    .onDisabled(() => waypoints.clear())

class Waypoint {
    constructor(key, title, x, y, z, extraText = "", lifespan = Settings().wpTime) {
        this.key = key
        this.title = title
        this.loc = new Vec3i(~~x - 0.5, ~~y, ~~z - 0.5)
        this.dist = this.loc.distance(Player.asPlayerMP().getPos())
        this.extraText = (extraText = extraText.trim()) && `\n${extraText}`
        this.text = this.formatText()

        waypoints.set(key, this)
        scheduleTask(() => this.remove(), new Second(lifespan))

        ChatWaypoints.register()
    }

    remove() {
        ChatWaypoints.unregister()

        if (waypoints.delete(this.key) && waypoints.size) ChatWaypoints.register()
    }

    updateRenderable() {
        if (this.dist < 5) return this.remove()

        this.dist = this.loc.distance(Player.asPlayerMP().getPos())
        this.text = this.formatText()
    }

    formatText() {
        return `${this.title} §b[${ this.dist }m]${this.extraText}`
    }
}

/*
"RENDERWORLD": {
            "index.js:1 -> ChatWaypoints.js:18 -> Feature.js:79 (addSubEvent) -> Event.js:20 (Event)": {
                "impact": "9193ms",
                "calls": "16656 calls",
                "avg": "0.5519ms/call"
            }
        },
        "RENDERWORLD": {
            "index.js:1 -> ChatWaypoints.js:11 -> Feature.js:82 (addSubEvent) -> Event.js:20 (Event)": {
                "impact": "17249ms",
                "calls": "38313 calls",
                "avg": "0.4502ms/call"
            }
        },
        "RENDERWORLD": {
            "index.js:1 -> ChatWaypoints.js:11 -> Feature.js:82 (addSubEvent) -> Event.js:20 (Event)": {
                "impact": "42692ms",
                "calls": "1319676 calls",
                "avg": "0.0324ms/call"
            },
        */