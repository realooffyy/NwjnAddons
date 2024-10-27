import Feature from "../../core/Feature"
import { Event } from "../../core/Event"
import RenderUtil from "../../core/static/RenderUtil"

const feat = new Feature({
  setting: "blockHighlight",
  otherSettings: "highlightColor"
})
  .addEvent(
    new Event("drawBlockHighlight", (_, event) => {
      const target = Player.lookingAt()

      if (target instanceof Entity || target instanceof BlockType) return
      cancel(event)

      RenderUtil.outlineBlock(target, ...feat.highlightColorValue, false, 3)
    })
  )