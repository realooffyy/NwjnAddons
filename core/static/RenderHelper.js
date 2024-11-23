// Based off https://github.com/DocilElm/Doc/blob/main/shared/Render.js

const AxisAlignedBB = net.minecraft.util.AxisAlignedBB
const IBlockStateAir = new BlockType("minecraft:air").getDefaultState()
const rm = Renderer.getRenderManager()

export default class RenderUtil {
    static getYaw() {
        return rm.field_78732_j
    }

    static getPitch() {
        return rm.field_78735_i
    }

    static getRenderPos() {
        return [rm.renderPosX, rm.renderPosY, rm.renderPosZ]
    }
    
    static getRenderDistanceBlocks() {
        return Client.settings.video.getRenderDistance() * 16
    }

    static getAxisCoords(aabb) {
        return [
            aabb.field_72340_a, // Min X
            aabb.field_72338_b, // Min Y
            aabb.field_72339_c, // Min Z
            aabb.field_72336_d, // Max X
            aabb.field_72337_e, // Max Y
            aabb.field_72334_f // Max Z
        ]
    }

    static isAABB(value) {
        return value instanceof AxisAlignedBB
    }

    static isAir(block) {
        return block.getState() == IBlockStateAir
    }

    static toAABB(x, y, z, w, h) {
        return new AxisAlignedBB(
            x - w / 2,
            y,
            z - w / 2,
            x + w / 2,
            y + h,
            z + w / 2
        ).func_72314_b(0.002, 0.002, 0.002)
    }

    /** @param {Block} ctBlock*/
    static getCTBlockAABB(ctBlock) {
        const MCBlockPos = ctBlock.pos.toMCBlock()
        const MCBlock = ctBlock.type.mcBlock
        const MCWorldClient = World.getWorld()

        if (!this.isAir(ctBlock))
            MCBlock.func_180654_a(MCWorldClient, MCBlockPos)

        // getSelectedBoundingBox - func_180646_a
        return MCBlock.func_180646_a(MCWorldClient, MCBlockPos)
            .func_72314_b(0.002, 0.002, 0.002) // func_72314_b - expand
    }

    static coerceToRenderDist(x, y, z) {
        const renderDistBlocks = this.getRenderDistanceBlocks()
        const [rx, ry, rz] = this.getRenderPos()
        const distTo = Math.hypot(rx - x, ry - y, rz - z)

        if (distTo < renderDistBlocks) return [x, y, z, 1]

        const scale = renderDistBlocks / distTo

        return [
            rx + (x - rx) * scale,
            ry + (y - ry) * scale,
            rz + (z - rz) * scale
        ]
    }
}