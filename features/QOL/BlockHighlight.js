import Feature from "../../core/Feature"
import RenderUtil from "../../core/static/RenderUtil"
import Settings from "../../data/Settings"

const DrawBlockHighlightEvent = net.minecraftforge.client.event.DrawBlockHighlightEvent
const BlockHit = net.minecraft.util.MovingObjectPosition.MovingObjectType.BLOCK

new Feature({setting: "blockHighlight"})
    .addEvent(DrawBlockHighlightEvent, (event) => {
        const target = event.target
        if (!target || target.field_72313_a !== BlockHit) return

        const pos = target.func_178782_a()
        const WorldClient = World.getWorld()
        if (!pos || WorldClient.func_175623_d(pos)) return

        const BlockState = WorldClient.func_180495_p(pos).func_177230_c()
        const AABB = BlockState.func_180646_a(WorldClient, pos).func_72314_b(0.002, 0.002, 0.002)
        
        const color = Settings().highlightColor
        RenderUtil.drawOutlinedAABB(AABB, color[0], color[1], color[2], color[3], false, 3)
        cancel(event)
    })