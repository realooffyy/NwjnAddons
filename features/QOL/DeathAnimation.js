import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import EventList from "../../libs/CustomEventFactory/EventList";
import { scheduleTask } from "../../utils/Ticker";
import EntityUtil from "../../core/static/EntityUtil";

new Feature({setting: "deathAnimation"})
  .addEvent(
    new Event(EventList.EntityDeath, (_, mcEntity) => {
      mcEntity.func_70106_y() // setDead
      
      scheduleTask(() => 
        EntityUtil.getMobStandTag(mcEntity)
          ?.func_70106_y() // setDead if fn returns the armorstand tag
      )
    })
  )