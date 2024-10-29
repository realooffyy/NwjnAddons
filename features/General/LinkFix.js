/** @see StuffysCipher */
import StuffysCipher from "../../core/static/StuffysCipher";
import TextUtil from "../../core/static/TextUtil";
import Feature from "../../core/Feature";
import EventEnums from "../../core/EventEnums";
import { Event } from "../../core/Event";


new Feature({setting: "linkFix"})
  .addEvent(
    new Event("messageSent", (msg, event) => {
      try {
        const [url] = TextUtil.getMatches(/([a-z\d]{2,}:\/\/[-\w.]+\.[a-z]{2,}(?:\d{1,5})?(?:\S*)?(?:\.\S+)?(?=[!"§ \n]|$))/, msg)
        if (!url) return
  
        cancel(event)
        ChatLib.say(
          msg.replace(url, StuffysCipher.encode(url))
        )
      } catch (err) {}
    })
  )
  .addEvent(
    new Event(EventEnums.SERVER.CHAT, (url, _, __, component) => {
      try {
        const decoded = `§n${StuffysCipher.decode(url)}§r`
  
        component.func_150253_a() // getSiblings
          .map(comp => {
            const text = comp.text
            if (!text.includes(url)) return comp
  
            const actionText = text.replace(url, decoded)
  
            // Bypass ChatTriggers messing up link text in TextComponent
            comp.text = actionText
  
            // Now use ChatTriggers' TextComponent
            return new TextComponent(comp)
              .setHover("show_text", decoded.removeFormatting())
              .setClick("open_url", decoded.removeFormatting())
              .chatComponentText
          })
      } catch (err) {}
    }, / (l\$(?:h|H)?\d+\|\S+)/)
  )