import Event from "../../libs/CustomEventFactory/Event"
import { data } from "../../data/Data";
import GuiFeature from "../../core/GuiFeature"

const EnumMinibosses = {
    "BLADESOUL": "&8Bladesoul",
    "BARBARIAN DUKE X": "&eBarbarian Duke X",
    "ASHFANG": "&cAshfang",
    "MAGMA BOSS": "&4Magma Boss",
    "MAGE OUTLAW": "&5Mage Outlaw"
}

const title = "&6Last Minibosses:\n"
const MinibossOverlay = new GuiFeature({
    setting: "mini",
    worlds: "Crimson Isle",
    
    name: "Last Minibosses",
    dataObj: data.Miniboss,
    baseText: title,
    _command: "nwjnMini"
})
    .addEvent(
        new Event("serverChat", (miniboss) => {
            const name = EnumMinibosses[miniboss]
            if (!name) return

            if (data.lastMini.push(name) > 4) data.lastMini.shift()
                MinibossOverlay.text = title + data.lastMini.join("\n")
        }, /^\S+(\s.+) DOWN!$/)
    )