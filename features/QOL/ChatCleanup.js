import Feature from "../../core/Feature";
import { Event } from "../../core/Event";
import EventEnums from "../../core/EventEnums";

new Feature({setting: "bossCleaner"})
  .addEvent(
    new Event(EventEnums.CLIENT.CHAT, (event) => {
      cancel(event)
    }, "[BOSS] ${*}")
)
  
new Feature({setting: "discordCleaner"})
  .addEvent(
    new Event(EventEnums.CLIENT.CHAT, (msg, event) => {
      cancel(event);
      ChatLib.chat(msg)
    }, "${msg}\n&r&cPlease be mindful of Discord links in chat as they may pose a security risk&r")
)
  
new Feature({setting: "visitorCleaner", worlds: "Garden"})
  .addEvent(
    new Event(EventEnums.CLIENT.CHAT, (event) => {
      cancel(event)
    }, "[NPC] ${*}")
  )