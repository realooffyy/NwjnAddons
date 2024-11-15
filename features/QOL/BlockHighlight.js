import Feature from "../../core/Feature"
import { Event } from "../../core/Event"
import RenderUtil from "../../core/static/RenderUtil"
import Settings from "../../data/Settings"

new Feature({setting: "blockHighlight"})
  .addEvent(
    new Event("drawBlockHighlight", (_, event) => {
      cancel(event)

      const target = Player.lookingAt()

      if (!target?.type) return

      const color = Settings().highlightColor
      RenderUtil.outlineBlock(target, color[0], color[1], color[2], color[3], false, 3)
    })
  )