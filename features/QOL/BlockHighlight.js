import Feature from "../../core/Feature"
import { Event } from "../../core/Event"
import Settings from "../../data/Settings"
import RenderUtil from "../../core/static/RenderUtil"

new Feature("blockHighlight")
  .addEvent(
    new Event("drawBlockHighlight", (_, event) => {
      const target = Player.lookingAt()

      if (target instanceof Entity || target instanceof BlockType) return
      cancel(event)

      const [ r, g, b, a ] = Settings().highlightColor
      RenderUtil.outlineBlock(target, r, g, b, a, false, 3)
    })
  )