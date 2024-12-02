/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/DraggableGui.js
 */

import Feature from "./Feature";
import { data } from "../data/Data";
import Event from "../libs/CustomEventFactory/Event";
import ElementUtils from "../../DocGuiLib/core/Element"
import HandleGui from "../../DocGuiLib/core/Gui"
import { CenterConstraint, CramSiblingConstraint, ScrollComponent, UIRoundedRectangle, UIText, OutlineEffect } from "../../Elementa"
import { addCommand } from "../utils/Command"
import Settings from "../data/Settings"

const guis = new HashMap()

export default class GuiFeature extends Feature {
    /**
     * - Extension of [Feature] for features that include gui elements
     * 
     * @param {Object} obj
     * @param {String} obj.setting The main config name: If null -> Feature is always active, If setting returns false -> all events of this feature will be unregistered
     * @param {String[]|String} obj.worlds The world(s) where this feature should activate: If null -> Feature is not world dependent
     * @param {String[]|String} obj.zones The zones(s) where this feature should activate: If null -> Feature is not zone dependent
     * 
     * @param {String} obj.name The gui name to show on the button in the editor
     * @param {Object} obj.dataObj The reference to the data with the x, y, scale values
     * @param {String} obj.baseText The text to shown in the editor if the feature's text is blank
     * @param {String} obj.color The feature's color setting (Not needed for texts with color codes)
    */
    constructor({
        setting = null,
        worlds = null,
        zones = null,

        name = null,
        dataObj = {},
        baseText = null,
        color = null
    } = {}) {
        super({setting, worlds, zones})

        if (!dataObj || !dataObj.x || !dataObj.y || !dataObj.scale) this.data = data[name] = {x: 0, y: 0, scale: 1}
        else this.data = dataObj

        this.gui = new Gui()
        this.gui.registerScrolled((_, __, dir) => this.data.scale += (dir * 0.02))
        this.gui.registerMouseDragged((mx, my) => {this.data.x = mx; this.data.y = my})
        this.gui.registerDraw(() => this._draw(this.message || baseText))
        guis.put(this.name = name, this.gui)

        if (color && color in Settings()) {
            this.color = Settings()[color]
            Settings().getConfig().registerListener(color, (_, val) => this.color = val)
        }
        else this.color = [255, 255, 255, 255]

        this.addEvent(this.render = new Event("renderOverlay", () => this._draw()))
    }
    
    /** Draw based on data */
    _draw(text = this.message, color = this.color, {x, y, scale} = this.data) {
        if (!text) return

        Renderer.retainTransforms(true)
        Renderer.translate(x, y)
        Renderer.scale(scale)
        Renderer.colorize(color[0], color[1], color[2], color[3])
        Renderer.drawStringWithShadow(text, 0, 0)
        Renderer.retainTransforms(false)
        Renderer.finishDraw()
    }

    /** Automatically un(register) the render event when setting the text */
    set text(txt) {
        txt ? this.render.register() : this.render.unregister() 

        return this.message = txt
    }
}


const handler = new HandleGui("data/Scheme.json", "NwjnAddons")
const scheme = handler.getColorScheme()

const bgBox = new UIRoundedRectangle(scheme.Amaterasu.background.roundness)
    .setX(new CenterConstraint())
    .setY(new CenterConstraint())
    .setWidth((30).percent())
    .setHeight((50).percent())
    .setColor(ElementUtils.getJavaColor(scheme.Amaterasu.background.color))
    .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(scheme.Amaterasu.background.outlineColor), scheme.Amaterasu.background.outlineSize))

const bgScrollable = new ScrollComponent("", 5)
    .setX(new CenterConstraint())
    .setY((1).pixels())
    .setWidth((80).percent())
    .setHeight((90).percent())
    .setChildOf(bgBox)

const scrollableSlider = new UIRoundedRectangle(3)
    .setX(new CramSiblingConstraint(2))
    .setY((5).pixels())
    .setHeight((5).pixels())
    .setWidth((5).pixels())
    .setColor(ElementUtils.getJavaColor(scheme.Amaterasu.scrollbar.color))
    .setChildOf(bgBox)

bgScrollable.setScrollBarComponent(scrollableSlider, true, false)

const buttons = new Set()

class ButtonComponent {
    constructor(name, gui) {
        this.bgButtonBox = new UIRoundedRectangle(scheme.Button.background.roundness)
            .setX((1).pixels())
            .setY(new CramSiblingConstraint(5))
            .setWidth((100).percent())
            .setHeight((12).percent())
            .setColor(ElementUtils.getJavaColor(scheme.Button.background.color))
            .enableEffect(new OutlineEffect(ElementUtils.getJavaColor(scheme.Button.background.outlineColor), scheme.Button.background.outlineSize))
            .setChildOf(bgScrollable)
            .onMouseClick((_, event) => {
                if (event.mouseButton === 0) gui.open()
            })

        this.buttonText = new UIText(name)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.bgButtonBox)

        buttons.add(name)
    }
}

addCommand("gui", "Opens the Editor Gui", () => {
    guis.forEach((name, gui) => {
        if (!buttons.has(name)) new ButtonComponent(name, gui)
    })

    handler.ctGui.open()
})

handler._drawNormal(bgBox)