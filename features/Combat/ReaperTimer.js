import GuiFeature from "../../core/GuiFeature";
import ItemUtil from "../../core/static/ItemUtil";
import { data } from "../../data/Data";
import { addCountdown, secondsToTick } from "../../utils/Ticker";

const prefix = "Reaper:"
const ReaperOverlay = new GuiFeature({
    setting: "reaperTimer",

    name: "Reaper",
    dataObj: data.Reaper,
    baseText: `${prefix} 0.00s`
})
    .addEvent("worldSound", () => {
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