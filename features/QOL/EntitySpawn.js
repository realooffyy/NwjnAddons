import Feature from "../../core/Feature";
import Event from "../../libs/CustomEventFactory/Event"

const options = [
  ["fallingBlocks", net.minecraft.entity.item.EntityFallingBlock],
  ["xpOrbs", net.minecraft.entity.item.EntityXPOrb],
  ["arrows", net.minecraft.entity.projectile.EntityArrow],
  ["witherSkulls", net.minecraft.entity.projectile.EntityWitherSkull]
]

options.forEach(([setting, clazz]) => {
  new Feature({setting})
    .addEvent(
      new Event("entityLoad", (entity) => {
        entity.func_70106_y()
      }, clazz)
    )
})