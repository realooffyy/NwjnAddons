import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import EventList from "../../libs/CustomEventFactory/EventList";

new Feature({
  setting: "damageTracker"
})
  .addEvent(
    new Event(EventList.SpawnMob, (entity) => {
      const name = entity.func_95999_t()

      if (!(/[^A-Za-z:-_.#]/.test(name?.removeFormatting()))) return
      ChatLib.chat(name)
    }, net.minecraft.entity.item.EntityArmorStand)
  )