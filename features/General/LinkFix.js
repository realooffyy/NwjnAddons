/** @see StuffysCipher */
import StuffysCipher from "../../core/static/StuffysCipher";
import Feature from "../../core/Feature";
import Event from "../../libs/CustomEventFactory/Event"


new Feature({setting: "linkFix"})
  .addEvent(
    new Event("messageSent", (msg, event) => {
      cancel(event)

      
      ChatLib.say(
        msg.replace(msg, StuffysCipher.encode(msg))
      )
    }, /([a-z\d]{2,}:\/\/[-\w.]+\.[a-z]{2,}(?:\d{1,5})?(?:\S*)?(?:\.\S+)?(?=[!"\S\n]|$))/)
  )
  .addEvent(
    new Event("serverChat", (url, _, __, component) => {
      try {
        const decoded = StuffysCipher.decode(url)

        if (!decoded) return
  
        component.func_150253_a() // getSiblings
          .map(comp => {
            const text = comp.text
            if (!text.includes(url)) return comp
  
            const actionText = text.replace(url, decoded)
  
            // Bypass CT messing up link text in new TextComponent & setText
            comp.text = actionText
  
            // Now use CT's TextComponent with MC's TextComponent
            return new TextComponent(comp)
              .setHover("show_text", decoded.removeFormatting())
              .setClick("open_url", decoded.removeFormatting())
              .chatComponentText
          })
      } catch (err) {}
    }, / (l\$(?:h|H)?\d+\|\S+)/)
  )