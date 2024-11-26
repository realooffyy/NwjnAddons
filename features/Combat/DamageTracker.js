import Feature from "../../core/Feature";
import Event from "../../libs/CustomEventFactory/Event"

new Feature({
  setting: "damageTracker"
})
  .addEvent(
    new Event("spawnMob", (entity) => {
      const name = entity.func_95999_t()

      if (!(/[^A-Za-z:-_.#]/.test(name?.removeFormatting()))) return
      ChatLib.chat(name)
    }, net.minecraft.entity.item.EntityArmorStand)
  )