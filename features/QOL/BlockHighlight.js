import Feature from "../../core/Feature"
import RenderUtil from "../../core/static/RenderUtil"
import RenderHelper from "../../core/static/RenderHelper"
import Settings from "../../data/Settings"

new Feature({setting: "blockHighlight"})
    .addEvent("drawBlockHighlight", (_, event) => {
        cancel(event)

        const target = Player.lookingAt()

        if (!target?.type) return

        const color = Settings().highlightColor
        RenderUtil.drawOutlinedAABB(RenderHelper.getCTBlockAABB(target), color[0], color[1], color[2], color[3], false, 3)
    })