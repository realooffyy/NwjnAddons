// Based off https://github.com/DocilElm/Doc/blob/main/shared/Render.js

const AxisAlignedBB = net.minecraft.util.AxisAlignedBB
const RenderGlobal = net.minecraft.client.renderer.RenderGlobal
const MCTessellator = net.minecraft.client.renderer.Tessellator.func_178181_a()
const DefaultVertexFormats = net.minecraft.client.renderer.vertex.DefaultVertexFormats
const WorldRenderer = MCTessellator.func_178180_c()
const IBlockStateAir = new BlockType("minecraft:air").getDefaultState()

// From BeaconBeam module
const ResourceLocation = net.minecraft.util.ResourceLocation
const MathHelper = net.minecraft.util.MathHelper
const beaconBeam = new ResourceLocation("textures/entity/beacon_beam.png")
const rm = Renderer.getRenderManager()
import RenderHelper from "./RenderHelper"

export default class RenderUtil {
    /**
     * - Based off DocilElm
     * @param {net.minecraft.util.AxisAlignedBB} aabb 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     * @param {Boolean} phase 
     * @param {Number} lineWidth 
     */
    static drawOutlinedAABB(aabb, r, g, b, a, phase = false, lineWidth = 3) {
        const [rx, ry, rz] = RenderHelper.getRenderPos()
        Tessellator
            .pushMatrix()
            .disableTexture2D()
            .enableBlend()
            .disableAlpha()
            .tryBlendFuncSeparate(770, 771, 1, 0)

        GL11.glLineWidth(lineWidth)

        Tessellator.translate(-rx, -ry, -rz)
        if (phase) Tessellator.disableDepth()

        RenderGlobal.func_181563_a(aabb, r, g, b, a) // drawOutlinedBoundingBox

        Tessellator.translate(rx, ry, rz)
        if (phase) Tessellator.enableDepth()

        Tessellator
            .disableBlend()
            .enableAlpha()
            .enableTexture2D()
            .colorize(1, 1, 1, 1)
            .popMatrix()

        GL11.glLineWidth(2)
    }

    /**
     * @param {number} x X axis
     * @param {number} y Y axis
     * @param {number} z Z axis
     * @param {number} w Width
     * @param {number} h Height
     * @param {number} r Red 0 - 255
     * @param {number} g Green 0 - 255
     * @param {number} b Blue 0 - 255
     * @param {number} a Alpha 0 - 255
     * @param {boolean} phase Whether to render the box through walls or not (`false` by default)
     * @param {number} lineWidth The width of the line
     */
    static drawOutlinedBox(x, y, z, w, h, r, g, b, a, phase = false, lineWidth = 3) {
        const aabb = RenderHelper.toAABB(x, y, z, w, h)
        this.drawOutlinedAABB(aabb, r, g, b, a, phase, lineWidth)
    }

    static drawFilledAABB(aabb, r, g, b, a, phase = true) {
        const [ x0, y0, z0, x1, y1, z1 ] = RenderHelper.getAxisCoords(aabb)
        
        const [ rx, ry, rz ] = RenderHelper.getRenderPos()

        Tessellator.pushMatrix()
        GlStateManager.func_179129_p()
        Tessellator
            .disableTexture2D()
            .enableBlend()
            .disableLighting()
            .disableAlpha()
            .tryBlendFuncSeparate(770, 771, 1, 0)
            .translate(-rx, -ry, -rz)
        
        if (phase) Tessellator.disableDepth()

        Tessellator.colorize(r / 255, g / 255, b / 255, a / 255)

        WorldRenderer.func_181668_a(5, DefaultVertexFormats.field_181705_e)
        WorldRenderer.func_181662_b(x0, y0, z0).func_181675_d()
        WorldRenderer.func_181662_b(x1, y0, z0).func_181675_d()
        WorldRenderer.func_181662_b(x0, y0, z1).func_181675_d()
        WorldRenderer.func_181662_b(x1, y0, z1).func_181675_d()
        WorldRenderer.func_181662_b(x0, y1, z1).func_181675_d()
        WorldRenderer.func_181662_b(x1, y1, z1).func_181675_d()
        WorldRenderer.func_181662_b(x0, y1, z0).func_181675_d()
        WorldRenderer.func_181662_b(x1, y1, z0).func_181675_d()
        WorldRenderer.func_181662_b(x0, y0, z0).func_181675_d()
        WorldRenderer.func_181662_b(x1, y0, z0).func_181675_d()
        MCTessellator.func_78381_a()

        WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181705_e)
        WorldRenderer.func_181662_b(x0, y0, z0).func_181675_d()
        WorldRenderer.func_181662_b(x0, y0, z1).func_181675_d()
        WorldRenderer.func_181662_b(x0, y1, z1).func_181675_d()
        WorldRenderer.func_181662_b(x0, y1, z0).func_181675_d()
        WorldRenderer.func_181662_b(x1, y0, z0).func_181675_d()
        WorldRenderer.func_181662_b(x1, y0, z1).func_181675_d()
        WorldRenderer.func_181662_b(x1, y1, z1).func_181675_d()
        WorldRenderer.func_181662_b(x1, y1, z0).func_181675_d()
        MCTessellator.func_78381_a()

        if (phase) Tessellator.enableDepth()
            
        Tessellator
            .translate(rx, ry, rz)
            .disableBlend()
            .enableAlpha()
            .enableTexture2D()
            .colorize(1, 1, 1, 1)

        GlStateManager.func_179089_o()
        Tessellator
            .enableLighting()
            .popMatrix()
    }

    /**
     * @param {number} x X axis
     * @param {number} y Y axis
     * @param {number} z Z axis
     * @param {number} w Width
     * @param {number} h Height
     * @param {number} r Red 0 - 255
     * @param {number} g Green 0 - 255
     * @param {number} b Blue 0 - 255
     * @param {number} a Alpha 0 - 255
     * @param {boolean} phase Whether to render the box through walls or not (`false` by default)
     */
    static drawFilledBox(x, y, z, w, h, r, g, b, a, phase = false) {
        const aabb = RenderHelper.toAABB(x, y, z, w, h)
        this.drawFilledBox(aabb, r, g, b, a, phase)
    }

    /**
     * @param {Block} ctBlock
     * @returns {AxisAlignedBB}
     */
    static getCTBlockAxis(ctBlock) {
        if (ctBlock.getState() != IBlockStateAir)
            ctBlock.type.mcBlock.func_180654_a(World.getWorld(), ctBlock.pos.toMCBlock())

        // getSelectedBoundingBox - func_180646_a
        return ctBlock.type.mcBlock.func_180646_a(World.getWorld(), ctBlock.pos.toMCBlock())
            .func_72314_b(0.002, 0.002, 0.002) // func_72314_b - expand
    }

    /**
     * - Draws a beacon beam
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} r 0 - 255
     * @param {number} g 0 - 255
     * @param {number} b 0 - 255
     * @param {number} a 0 - 255
     * @param {boolean} phase Whether it should render through walls or not
     * @param {number} height The limit height for the beam to render to (`300` by default)
     * @param {boolean} translate Whether to translate the rendering coords to the [RenderViewEntity] coords (`true` by default)
     * @link From [NotEnoughUpdates](https://github.com/NotEnoughUpdates/NotEnoughUpdates/blob/master/src/main/java/io/github/moulberry/notenoughupdates/core/util/render/RenderUtils.java#L220)
     */
    static renderBeaconBeam(x, y, z, r, g, b, a, phase = false, height = 300) {
        ({x, y, z} = Tessellator.getRenderPos(x, y, z))

        Tessellator.pushMatrix()

        if (phase) Tessellator.disableDepth()

        r = r / 255
        g = g / 255
        b = b / 255
        a = a / 255

        Client.getMinecraft().func_110434_K().func_110577_a(beaconBeam) //getTextureManager().bindTexture()

        GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_REPEAT)
        GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT)

        Tessellator.disableLighting()
        GlStateManager.func_179089_o()
            
        Tessellator
            .enableTexture2D()
            .tryBlendFuncSeparate(GL11.GL_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE, GL11.GL_ZERO)
            .enableBlend()
            .tryBlendFuncSeparate(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ZERO)

        const time = World.getTime() + Tessellator.getPartialTicks()
        const d1 = MathHelper.func_181162_h(-time * 0.2 - MathHelper.func_76128_c(-time * 0.1))
        const d2 = time * 0.025 * -1.5
        const d4 = 0.5 + Math.cos(d2 + 2.356194490192345) * 0.2
        const d5 = 0.5 + Math.sin(d2 + 2.356194490192345) * 0.2
        const d6 = 0.5 + Math.cos(d2 + (Math.PI / 4)) * 0.2
        const d7 = 0.5 + Math.sin(d2 + (Math.PI / 4)) * 0.2
        const d8 = 0.5 + Math.cos(d2 + 3.9269908169872414) * 0.2
        const d9 = 0.5 + Math.sin(d2 + 3.9269908169872414) * 0.2
        const d10 = 0.5 + Math.cos(d2 + 5.497787143782138) * 0.2
        const d11 = 0.5 + Math.sin(d2 + 5.497787143782138) * 0.2
        const d14 = -1 + d1
        const d15 = height * 2.5 + d14

        WorldRenderer.func_181668_a(GL11.GL_QUADS, DefaultVertexFormats.field_181709_i)
        WorldRenderer.func_181662_b(x + d4, y + height, z + d5).func_181673_a(1, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d4, y, z + d5).func_181673_a(0, d14).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d6, y, z + d7).func_181673_a(0, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d6, y + height, z + d7).func_181673_a(0, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d10, y + height, z + d11).func_181673_a(1, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d10, y, z + d11).func_181673_a(1, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d8, y, z + d9).func_181673_a(0, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d8, y + height, z + d9).func_181673_a(0, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d6, y + height, z + d7).func_181673_a(1, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d6, y, z + d7).func_181673_a(1, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d10, y, z + d11).func_181673_a(0, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d10, y + height, z + d11).func_181673_a(0, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d8, y + height, z + d9).func_181673_a(1, d15).func_181666_a(r, g, b, a).func_181675_d()
        WorldRenderer.func_181662_b(x + d8, y, z + d9).func_181673_a(1, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d4, y, z + d5).func_181673_a(0, d14).func_181666_a(r, g, b, 1).func_181675_d()
        WorldRenderer.func_181662_b(x + d4, y + height, z + d5).func_181673_a(0, d15).func_181666_a(r, g, b, a).func_181675_d()
        MCTessellator.func_78381_a()

        GlStateManager.func_179129_p()

        const d12 = -1 + d1
        const d13 = height + d12

        WorldRenderer.func_181668_a(GL11.GL_QUADS, DefaultVertexFormats.field_181709_i)
        WorldRenderer.func_181662_b(x + 0.2, y + height, z + 0.2).func_181673_a(1, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y, z + 0.2).func_181673_a(1, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y, z + 0.2).func_181673_a(0, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y + height, z + 0.2).func_181673_a(0, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y + height, z + 0.8).func_181673_a(1, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y, z + 0.8).func_181673_a(1, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y, z + 0.8).func_181673_a(0, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y + height, z + 0.8).func_181673_a(0, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y + height, z + 0.2).func_181673_a(1, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y, z + 0.2).func_181673_a(1, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y, z + 0.8).func_181673_a(0, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.8, y + height, z + 0.8).func_181673_a(0, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y + height, z + 0.8).func_181673_a(1, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y, z + 0.8).func_181673_a(1, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y, z + 0.2).func_181673_a(0, d12).func_181666_a(r, g, b, 0.25).func_181675_d()
        WorldRenderer.func_181662_b(x + 0.2, y + height, z + 0.2).func_181673_a(0, d13).func_181666_a(r, g, b, 0.25 * a).func_181675_d()
        MCTessellator.func_78381_a()

        if (phase) Tessellator.enableDepth()

        Tessellator
            .enableLighting()
            .enableTexture2D()
            .popMatrix()
    }
    
    static renderWaypoint(text, x, y, z, r, g, b, a, phase = true, scale = 1) {
        [x, y, z, scale] = RenderHelper.coerceToRenderDist(x, y, z)

        const aabb = RenderHelper.toAABB(x, y, z, 1, 1)

        this.drawOutlinedAABB(aabb, r, g, b, a, phase, 2)
        this.drawFilledAABB(aabb, r, g, b, 50, phase)
        this.drawString(text, x, y + 3, z)
        this.renderBeaconBeam(x + 0.5, y, z + 0.5, r, g, b, 150, phase)
    }
    
    /**
     * - Chattriggers' Tessellator.drawString() with depth check and multiline
     * - Renders floating lines of text in the 3D world at a specific position.
     *
     * @param {String} text The text to render
     * @param {Number} x X coordinate in the game world
     * @param {Number} y Y coordinate in the game world
     * @param {Number} z Z coordinate in the game world
     * @param {Number} color the color of the text
     * @param {Boolean} renderBlackBox
     * @param {Number} scale the scale of the text
     * @param {Boolean} increase whether to scale the text up as the player moves away
     * @param {Boolean} shadow whether to render shadow
     * @param {Boolean} depth whether to render through walls
     */
    static drawString(
        text,
        x,
        y,
        z,
        color = 0xffffff,
        renderBlackBox = true,
        scale = 1,
        increase = true,
        shadow = true,
        depth = true
    ) {
        ({ x, y, z } = Tessellator.getRenderPos(x, y, z))
        
        const lScale = increase 
            ? scale * Math.hypot(x, y, z) / RenderHelper.getRenderDistanceBlocks()
            : scale
        const xMulti = Client.getMinecraft().field_71474_y.field_74320_O == 2 ? -1 : 1; //perspective
        
        Tessellator
            .colorize(1, 1, 1, 0.5)
            .pushMatrix()

            .translate(x, y, z)
            .rotate(-rm.field_78735_i, 0, 1, 0)
            .rotate(rm.field_78732_j * xMulti, 1, 0, 0)

            .scale(-lScale, -lScale, lScale)
            .disableLighting()
            .depthMask(false)
            
        if (depth) Tessellator.disableDepth()

        Tessellator
            .enableBlend()
            .blendFunc(770, 771)
            
        const lines = text.addColor().split("\n")
        const l = lines.length
        const maxWidth = Math.max(...lines.map(it => Renderer.getStringWidth(it))) / 2

        if (renderBlackBox) {
            Tessellator.disableTexture2D()
            WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181706_f)
            WorldRenderer.func_181662_b(-maxWidth - 1, -1 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d()
            WorldRenderer.func_181662_b(-maxWidth - 1, 9 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d()
            WorldRenderer.func_181662_b(maxWidth + 1, 9 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d()
            WorldRenderer.func_181662_b(maxWidth + 1, -1 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d()
            MCTessellator.func_78381_a()
            Tessellator.enableTexture2D()
        }

        lines.forEach((it, idx) => {
            Renderer.getFontRenderer().func_175065_a(it, -Renderer.getStringWidth(it) / 2, idx * 9, color, shadow)
        })

        Tessellator
            .colorize(1, 1, 1, 1)
            .depthMask(true)
            .enableDepth()
            .popMatrix()
    }
}