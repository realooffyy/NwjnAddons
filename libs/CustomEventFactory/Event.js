/** 
 * Virtually entire class taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Event.js
 */

import { getEvent } from "./EventMap"

export default class Event {
    /**
     * Register Handler for events
     * @param {String|JavaTPath["net.minecraftforge.fml.common.eventhandler.Event"]} triggerType 
     * @param {(...args) => void} method 
     * @param {any} arg
     * @param {Boolean} orphan
     */
    constructor(triggerType, method, args, orphan = false) {
        if (orphan) {
            return getEvent(triggerType, method, args).register()
        }
            
        // Register event from correct source
        this._event = getEvent(triggerType, method, args)
        this.isRegistered = false
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