/** 
 * Virtually entire class taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Feature.js
 */

import Settings from "../data/Settings";
import Location from "../utils/Location"
import Event from "../libs/CustomEventFactory/Event";

/**
 * - Class to handle Events and SubEvents of a feature
 * - Usually used in tandem with settings unless extra utility is needed—in which case [obj.setting] is omitted
 * 
 * - Huge thanks to DocilElm
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Feature.js
 */
export default class Feature {
    /**
     * - Class that handles event based utilities
     * - For example waiting for the proper world to be loaded in order
     * - to register the event/subEvents
     * @param {Object} obj
     * @param {String} obj.setting The feature name (config name) for this Feature
     * @param {String[]|String} obj.worlds The required world for this Feature (if left empty it will not check)
     * @param {String[]|String} obj.zones The required area for this Feature (if left empty it will not check)
     */
    constructor({
        setting = null,
        worlds = null,
        zones = null
    } = {}) {
        // Events stuff
        /** @type {Event[]}*/ this.events = []
        /** @type {[Event, () => Boolean][]} */ this.subEvents = []

        this.isRegistered = false

        // Listeners
        this._onRegister = []
        this._onUnregister = []

        if (setting in Settings()) {
            this.setting = setting
            this.settingValue = Settings()[setting]
    
            Settings().getConfig().registerListener(setting, (_, val) => {
                this.settingValue = val
                this._updateRegister()
            })
        }

        if (worlds) {
            this.worlds = Array.isArray(worlds) ? worlds : Array(worlds)
            Location.registerWorldChange(() => this._updateRegister())
        }
        if (zones) {
            this.zones = Array.isArray(zones) ? zones : Array(zones)
            Location.registerZoneChange(() => this._updateRegister())
        }

        // Feature should be updated when the world changes
        register("worldLoad", () => this._updateRegister())
        register("worldUnload", () => this._unregister())
    }

    /**
     * - Internal use.
     * - Note: #inWorld and #inZone return true if param is nullish
     * @returns {this} meth chain
     */
    _updateRegister() {
        if (this.setting && !this.settingValue) return this._unregister()
        if (!(Location.inWorld(this.worlds) && Location.inZone(this.zones))) return this._unregister()
        
        return this._register()
    }

    /**
     * - Internal use.
     * - Unregisters all of the events and subEvents for this Feature
     * - Only unregisters if the events have been registered before-hand
     * @returns {this} meth chain
     */
    _unregister() {
        if (!this.isRegistered) return this
        
        for (let event of this.events) event.unregister()
        for (let subEvent of this.subEvents) subEvent[0].unregister()
        for (let listener of this._onUnregister) listener?.()
    
        this.isRegistered = false
        return this
    }

    /**
     * - Internal use.
     * - Registers all of the events and triggers the listener for this Feature
     * - Only registers the events if it should and if they haven't been registered before-hand
     * @returns {this} meth chain
     */
    _register() {
        if (this.isRegistered) return this
        
        for (let event of this.events) event.register()
        for (let listener of this._onRegister) listener?.()
    
        this.isRegistered = true
        return this
    }

    /**
     * - Adds a [Event] to this Feature
     * @param {String|Event} triggerType
     * @param {() => void} methodFn
     * @param {any} args
     * @returns {this} meth chain
     */
    addEvent(triggerType, methodFn, args) {
        if (triggerType instanceof Event) this.events.push(triggerType)
        else this.events.push(new Event(triggerType, methodFn, args))

        return this
    }

    /**
     * - Adds a [SubEvent] to this Feature
     * @param {String} triggerType
     * @param {() => void} methodFn
     * @param {any} args
     * @param {() => Boolean} condition The function that will be ran whenever this subEvent gets updated
     * @returns {this} meth chain
     */
    addSubEvent(triggerType, methodFn, args, condition = () => true) {
        this.subEvents.push([
            new Event(triggerType, methodFn, args),
            condition
        ])

        return this
    }

    /**
     * - Calls the given function whenever this Feature's events have been registered
     * @param {() => void} fn
     * @returns {this} meth chain   
     */
    onRegister(fn) {
        this._onRegister.push(fn)

        return this
    }

    /**
     * - Calls the given function whenever this Feature's events have been unregistered
     * @param {() => void} fn
     * @returns {this} meth chain
     */
    onUnregister(fn) {
        this._onUnregister.push(fn)

        return this
    }

    /**
     * - Calls all of the subEvents for update
     * - Each subEvent's function is ran to see whether it should be registered or not
     * @returns {this} meth chain
     */
    update() {
        for (let it of this.subEvents) {
            let [ subEvent, condition ] = it // grr Rhino

            condition() ? subEvent.register() : subEvent.unregister()
        }

        return this
    }

    registerSubsOnly() {
        for (let subEvent of this.subEvents) subEvent[0].register()
        for (let listener of this._onRegister) listener?.()

        return this
    }

    unregisterSubsOnly() {
        for (let subEvent of this.subEvents) subEvent[0].unregister()
        for (let listener of this._onUnregister) listener?.()

        return this
    }
}