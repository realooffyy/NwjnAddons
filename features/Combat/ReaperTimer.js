import GuiFeature from "../../core/GuiFeature";
import EventEnums from "../../core/EventEnums";
import { Event } from "../../core/Event";
import ItemUtil from "../../core/static/ItemUtil";
import { data } from "../../data/Data";
import { addCountdown, secondsToTick, tickToSeconds } from "../../utils/Ticker";

const prefix = "Reaper:"
const ReaperOverlay = new GuiFeature({
    setting: "reaperTimer",

    name: "Reaper",
    dataObj: data.Reaper,
    baseText: `${prefix} 0.00s`,
    _command: "nwjnReaper"
})
    .addEvent(
        new Event(EventEnums.CLIENT.SOUNDPLAY, () => {
            if (
                ItemUtil.getSkyblockItemID(Player.armor.getChestplate())
                !==
                "REAPER_CHESTPLATE"
            ) return
            
            addCountdown(
                (ticks) => ReaperOverlay.text = `${prefix} ${ticks.toFixed(2)}s`, 
                secondsToTick(6)
            )
        }, "mob.zombie.remedy")
    )