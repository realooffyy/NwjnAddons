import Feature from "../../core/Feature";
import {log} from "../../core/static/TextUtil";

const lastBar = [Date.now(), ""]
new Feature({setting: "skyblockXP"})
    .addEvent("actionBarChange", (xp, category, progress) => {
        const msg = `§b${xp} §7${category} §b${progress}`
        if (Date.now() - lastBar[0] < 5000 && msg == lastBar[1]) return
        lastBar[0] = Date.now()
        lastBar[1] = msg
        log(msg)
    }, /\s{5}(\+\d{1,4} SkyBlock XP) (\(.+\)) (\(\d{1,2}\/100\))\s{5}/)