import STuF from "../../core/static/STuF";
import TextUtil from "../../core/static/TextUtil";
import Feature from "../../core/Feature";
import EventEnums from "../../core/EventEnums";
import { Event } from "../../core/Event";

new Feature("linkFix")
  .addEvent(
    new Event("messageSent", (msg, event) => {
      const [url] = TextUtil.getMatches(/(https?:\/\/.+\..+\/.+(\.(?:png|jpe?g|gif)?)?)/, msg)
      if (!url) return

      cancel(event)
      ChatLib.say(
        msg.replace(url, STuF.encode(url))
      )
    })
  )
  .addEvent(
    new Event(EventEnums.SERVER.CHAT, (url, _, __, component) => {
      const decoded = STuF.decode(url)
      for (let comp of component.func_150253_a()) { // getSiblings
        let text = comp.text
        if (text.includes(url)) {
          comp.text = text.replace(url, decoded)
          comp
            .func_150256_b() // getChatStyle
            .func_150209_a( // setChatHoverEvent
              new net.minecraft.event.HoverEvent(
                net.minecraft.event.HoverEvent$Action.SHOW_TEXT,
                new net.minecraft.util.ChatComponentText(comp.text)
              )
            )
        }
      }
    }, /(l\$[hH][1-4]?[0-9]*\|[\w\^\/\.\-]+)/)
  )