import Feature from "../../core/Feature.js";
import EventEnums from "../../core/EventEnums.js";
import { Event } from "../../core/Event.js";
import { notify } from "../../core/static/TextUtil.js";
import RenderUtil from "../../core/static/RenderUtil.js"

const data = JSON.parse(FileLib.read("NwjnAddons", "features/Mining/MineshaftWaypointsData.json"))
let currentCorpses = []
let currentRoom = null

/** @todo make a quick check for vang which immediately checks for a gold block at a coord relative to the player's location */
const feat = new Feature({
    setting: "mineshaftWaypoints",
    zones: "Glacite Mineshafts"
    // Does not use Mineshaft as world because the scoreboard check is always triggered before it
})
    .addEvent(
        new Event(EventEnums.SERVER.SCOREBOARD, (id, material, type) => {
            if (currentRoom) return
            if (type != 2 && !(id in data.rooms)) return

            currentRoom = data.rooms[type == 2 ? type : id]
            currentCorpses = currentRoom.corpses
            
            const name = data.names[material]
            const formatName = type == 2 ? `${name} Crystal` : name

            notify(formatName)
            feat.update()

            if (id === "FAIR1") {
                new TextComponent("&eClick here to notify guild of the Vanguard!")
                    .setClickAction("run_command")
                    .setClickValue(`gc ${formatName}`)
                    .chat()
                new TextComponent("&eClick here to stream open")
                    .setClickAction("run_command")
                    .setClickValue("stream open")
                    .chat()
            }
        }, / (([A-Z]{4})(1|2))$/)
    )
    .addSubEvent(
        new Event(EventEnums.INTERVAL.FPS, () => {
            const canDelete = currentCorpses.findIndex(corpse => Player.asPlayerMP().distanceTo(...corpse) > 5)
            if (~canDelete) return currentCorpses.splice(canDelete, 1)
        }, 3),
        () => currentRoom
    )
    .addSubEvent(
        new Event("renderWorld", () => {
            RenderUtil.renderWaypoint("§bExit", ...currentRoom.exit, 255, 0, 0, 255)

            currentCorpses.forEach(corpse => RenderUtil.renderWaypoint("§cGuess", ...corpse, 255, 0, 0, 255))
        }),
        () => currentRoom
    )
    .onUnregister(() => {
        currentRoom = null
        currentCorpses.length = 0
    })