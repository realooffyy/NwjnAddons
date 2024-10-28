/** @see StuffysCipher */
import StuffysCipher from "../../core/static/StuffysCipher";
import TextUtil from "../../core/static/TextUtil";
import Feature from "../../core/Feature";
import EventEnums from "../../core/EventEnums";
import { Event } from "../../core/Event";

new Feature({setting: "linkFix"})
  .addEvent(
    new Event("messageSent", (msg, event) => {
      const [url] = TextUtil.getMatches(/((?:https?:\/\/)?\S+\/\S+(?:\.(?:png|jpe?g|gif))?)/, msg)
      if (!url) return

      cancel(event)
      ChatLib.say(
        msg.replace(url, StuffysCipher.encode(url))
      )
    })
  )
  .addEvent(
    new Event(EventEnums.SERVER.CHAT, (url, event, _, component) => {
      const decoded = StuffysCipher.decode(url)

      const mappedComp = component.func_150253_a() // getSiblings
        .map(comp => {
          const text = comp.text
          if (!text.includes(url)) return comp

          const actionText = text.replace(url, decoded)

          // Bypass ChatTriggers messing up link text in TextComponent
          comp.text = "§n" + actionText

          // Now use ChatTriggers' TextComponent
          return new TextComponent(comp)
            .setHover("show_text", actionText.removeFormatting())
            .setClick("open_url", actionText.removeFormatting())
            .chatComponentText
        })

      new Message(mappedComp).chat()
      cancel(event)
    }, / (l\$\S?\S?\d+\|\S+)/)
  )