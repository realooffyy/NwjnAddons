import Feature from "../../core/Feature";
import Event from "../../libs/CustomEventFactory/Event"

new Feature({setting: "miscShit"})
  .addEvent(
    new Event("spawnObject", (packet, event) => {
      if (
        packet.func_149010_g() === 0 &&
        packet.func_149004_h() === 0 &&
        packet.func_148999_i() === 0 &&
        packet.func_149009_m() !== 0
      ) cancel(event)
    })
  )