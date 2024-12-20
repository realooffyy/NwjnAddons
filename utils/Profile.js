import TextUtil from "../core/static/TextUtil"
import Event from "../libs/CustomEventFactory/Event"
import { data } from "../data/Data"
import { scheduleTask } from "../libs/Time/ServerTime"
import Tick from "../libs/Time/Tick"
import { addCommand } from "./Command"

// [Power Stone]
new Event(
    "serverChat", 
    (stone) => data.power = stone, 
    /^You selected the (.+) power for your Accessory Bag!$/,
    true
)

// [Enrichments]
new Event(
    "serverChat", 
    (volume, stat) => data.enrich = `${volume} ${stat}`, 
    /^Swapped (\d{1,3}) enrichments to (.+)!$/,
    true
)

// [Tunings + Magical Power]
new Event("containerClick", (window) => {
    if (window !== "Stats Tuning") return

    scheduleTask(() => {
        const lore = Player.getContainer()?.getStackInSlot(4)?.getLore()?.join("\n")?.removeFormatting()
        if (!lore) return

        const tuning = lore.match(/\+(\d+.) /g)
        data.tuning = tuning?.join(" ") ?? "Unknown"

        const [magPow] = TextUtil.getMatches(/Magical Power: (.+)/, lore)
        data.mp = magPow ?? "Unknown"
    }, new Tick(2))
}, null, true)

// Credit: DocilElm for blacklist
const INVALID = () => notify("&cInvalid. &aAdd and remove need name entry. List and clear do not.")

addCommand("bl", "Blacklist <add, remove, list, clear> <name?> <reason?>", (type, name, reason) => {
    if (!type) return INVALID()
    [type, name] = [type?.toLowerCase(), name?.toLowerCase()]

    switch (type.toLowerCase()) {
        case "add": {
            if (!name) return INVALID()

            data.blacklist[name] = reason ?? "No reason given."
            return notify(`&aAdded &c${name} &ato your blacklist`)
        }
            
        case "remove": {
            if (!name) return INVALID()
            
            delete data.blacklist[name]
            return notify(`&aRemoved &c${name} &afrom your blacklist.`)
        }
        
        case "list": {
            notify("&cBlacklist:")
            return Object.entries(data.blacklist).forEach(([ign, reason]) => 
                new TextComponent(`  - &a${ign}&f: &c${reason}`)
                    .setHover("show_text", `Click to run "/nwjn bl remove ${ign}" to remove ${ign} from the blacklist.`)
                    .setClick("run_command", `/nwjn bl remove ${ign}`)
                    .chat()
            )
        }  
    
        case "clear": {
            data.blacklist = {}
            return notify("&aCleared your blacklist.")
        }
        
        default: {
            return INVALID()
        }
    }
})