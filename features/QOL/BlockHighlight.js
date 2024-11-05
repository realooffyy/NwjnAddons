import Feature from "../../core/Feature"
import { Event } from "../../core/Event"
import RenderUtil from "../../core/static/RenderUtil"
import Settings from "../../data/Settings"

new Feature({setting: "blockHighlight"})
  .addEvent(
    new Event("drawBlockHighlight", (_, event) => {
      cancel(event)
      
      /** @type {Block|Sign|Entity|BlockType} BlockType means its air*/
      const target = Player.lookingAt()

      // "type" is only in Block and Sign; returns if its Entity or BlockType
      if (!("type" in target)) return

      const [r, g, b, a] = Settings().highlightColor
      RenderUtil.outlineBlock(target, r, g, b, a, false, 3)
    })
  )