import EventList from "../../libs/CustomEventFactory/EventList";
import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import { log } from "../../core/static/TextUtil";

let lastbar = [Date.now(), ""]
new Feature({setting: "skyblockXP"})
  .addEvent(
    new Event(EventList.ServerChat, (xp, category, progress) => {
      const msg = `§b${xp} §7${category} §b${progress}`
      if (Date.now() - lastbar[0] < 5000 && msg == lastbar[1]) return
      lastbar = [Date.now(), msg]
      log(msg)
    }, /\s{5}(\+\d{1,3} SkyBlock XP) (\(.+\)) (\(\d{1,2}\/100\))\s{5}/)
)