import Feature from "../../core/Feature";
import {log} from "../../core/static/TextUtil";
import { scheduleTask } from "../../libs/Time/ServerTime";
import Second from "../../libs/Time/Second";

const SkyblockXP = new Feature({setting: "skyblockXP"})
    .addEvent("actionBarChange", (xp, category, progress) => {
        log(`§b${xp} §7${category} §b${progress}`)
        
        SkyblockXP._unregister()
        scheduleTask(() => SkyblockXP._register(), new Second(2))
    }, /\s{5}(\+\d{1,3} SkyBlock XP) (\(.+\)) (\(\d{1,2}\/100\))\s{5}/)