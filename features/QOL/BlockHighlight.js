import Feature from "../../core/Feature"
import RenderUtil from "../../core/static/RenderUtil"
import Settings from "../../data/Settings"

const DrawBlockHighlightEvent = net.minecraftforge.client.event.DrawBlockHighlightEvent
const BlockHit = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK

new Feature({setting: "blockHighlight"})
    .addEvent(DrawBlockHighlightEvent, (event) => {
        const target = event.target
        if (target?.["typeOfHit", "field_72313_a"] !== BlockHit) return

        const pos = target["getBlockPos", "func_178782_a"]()
        const WorldClient = World.getWorld()
        if (!pos || WorldClient["isAirBlock", "func_175623_d"](pos)) return

        const BlockState = WorldClient["getStateAt", "func_180495_p"](pos)["getBlock", "func_177230_c"]()
        const AABB = BlockState["getSelectedBoundingBox", "func_180646_a"](WorldClient, pos)
        
        const color = Settings().highlightColor
        RenderUtil.drawOutlinedAABB(AABB, color[0], color[1], color[2], color[3], false, 3)
        cancel(event)
    })