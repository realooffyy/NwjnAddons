import Feature from "../../core/Feature"
import { Event } from "../../core/Event"
import RenderUtil from "../../core/static/RenderUtil"
import Settings from "../../data/Settings"

new Feature({setting: "blockHighlight"})
  .addEvent(
    new Event("drawBlockHighlight", (_, event) => {
      cancel(event)

      const target = Player.lookingAt()

      if (!("type" in target)) return

      const [r, g, b, a] = Settings().highlightColor
      RenderUtil.outlineBlock(target, r, g, b, a, false, 3)
    })
  )