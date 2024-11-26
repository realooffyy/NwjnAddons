import GuiFeature from "../../core/GuiFeature";
import Event from "../../libs/CustomEventFactory/Event"
import ItemUtil from "../../core/static/ItemUtil";
import { data } from "../../data/Data";
import { addCountdown, secondsToTick } from "../../utils/Ticker";

const prefix = "Reaper:"
const ReaperOverlay = new GuiFeature({
    setting: "reaperTimer",

    name: "Reaper",
    dataObj: data.Reaper,
    baseText: `${prefix} 0.00s`,
    _command: "nwjnReaper"
})
    .addEvent(
        new Event("worldSound", () => {
            if (
                ItemUtil.getSkyblockItemID(Player.armor.getChestplate())
                !==
                "REAPER_CHESTPLATE"
            ) return
            
            addCountdown(
                (ticks) => ReaperOverlay.text = ticks ? `${prefix} ${ticks.toFixed(2)}s` : null, 
                secondsToTick(6)
            )
        }, "mob.zombie.remedy")
    )