// Based off https://github.com/DocilElm/Doc/blob/main/shared/Render.js

const AxisAlignedBB = net.minecraft.util.AxisAlignedBB
const rm = Renderer.getRenderManager()

export default class RenderUtil {
    static getRenderX() {
        return rm.renderPosX
    }

    static getRenderY() {
        return rm.renderPosY
    }

    static getRenderZ() {
        return rm.renderPosZ
    }

    static getRenderPos() {
        return [this.getRenderX(), this.getRenderY(), this.getRenderZ()]
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
        return block.type.getRegistryName() === "minecraft:air"
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

    static getCTBlockAABB(CTBlock) {
        if (!this.isAir(CTBlock))
            CTBlock.type.mcBlock.func_180654_a(World.getWorld(), CTBlock.pos.toMCBlock())

        // getSelectedBoundingBox - func_180646_a
        return CTBlock.type.mcBlock.func_180646_a(World.getWorld(), CTBlock.pos.toMCBlock())
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
            rz + (z - rz) * scale,
            1 / scale
        ]
    }
}