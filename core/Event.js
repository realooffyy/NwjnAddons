/** 
 * Virtually entire class taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Event.js
 */

import { customTriggers } from "./CustomRegisters"

export class Event {
    // Custom triggers are number enums
    static _createRegisterCustom = (type, onTrigger, args) => customTriggers.get(type)(onTrigger, args).unregister()

    static _createRegisterNormal = (type, onTrigger) => register(type, onTrigger).unregister()

    /**
     * Register Handler for events
     * @param {Number|String|net.minecraftforge.fml.common.eventhandler.Event} type 
     * @param {(...args) => void} onTrigger 
     * @param {any?} args
     */
    constructor(type, onTrigger, args) {
        // Custom triggers are numbers
        this._event = typeof(type) === "number"
            ? Event._createRegisterCustom(type, onTrigger, args)
            : Event._createRegisterNormal(type, onTrigger)
            
        this.isRegistered = false
            
        if (!this._event) throw new Error("Improper Event Formatting")
    }

    /**
     * - Registers this [event]'s trigger
     * @returns this for method chaining
     */
    register() {
        if (this.isRegistered) return this

        this._event.register()
        this.isRegistered = true

        return this
    }

    /**
     * - Unregisters this [event]'s trigger
     * @returns this for method chaining
     */
    unregister() {
        if (!this.isRegistered) return this

        this._event.unregister()
        this.isRegistered = false

        return this
    }
}