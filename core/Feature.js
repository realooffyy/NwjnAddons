/** 
 * Adaptation based upon:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Feature.js
 */

import Settings from "../data/Settings";
import Location from "../utils/Location"
import Event from "../libs/CustomEventFactory/Event";

export default class Feature {
    /**
     * - Utility that handles registering various events and listeners to make complex, functional, and performative features
     * - Class can be used with or without requiring the settings, worlds, or zones fields depending on the intended functionality
     * 
     * @param {Object} obj
     * @param {String} obj.setting The main config name: If null -> Feature is always active, If setting returns false -> all events of this feature will be unregistered
     * @param {String[]|String} obj.worlds The world(s) where this feature should activate: If null -> Feature is not world dependent
     * @param {String[]|String} obj.zones The zones(s) where this feature should activate: If null -> Feature is not zone dependent
     */
    constructor({
        setting = null,
        worlds = null,
        zones = null
    } = {}) {
        // Events & listeners
        this.events = []
        this.subEvents = []
        this.registerListeners = []
        this.unregisterListeners = []

        this.isRegistered = false

        // Feature should listen for setting changes if required
        if (setting in Settings()) {
            this.setting = setting
            this.settingValue = Settings()[setting]
    
            Settings().getConfig().registerListener(setting, (_, val) => {
                this.settingValue = val
                this._updateRegister()
            })
        }

        // Feature should be updated when the area changes
        if (worlds) this.worlds = Array.isArray(worlds) ? worlds : Array(worlds)
        Location.registerWorldChange(() => this._updateRegister())

        if (zones) {
            this.zones = Array.isArray(zones) ? zones : Array(zones)
            Location.registerWorldChange(() => this._updateRegister())
        }
    }

    /**
     * - Adds an [Event] that is registered as long as the Feature is
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
     * - Adds a (conditional Event) aka [SubEvent] that is (un)registered by the main events
     * @param {String} triggerType
     * @param {(...args) => void} methodFn
     * @param {any} args
     * @param {() => Boolean} condition The function to check if this subEvent should be (un)registered
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
     * - Tags a listener function that's called when this [Feature] is registered
     * @param {Function} fn
     * @returns {this} meth chain   
     */
    onRegister(fn) {
        this.registerListeners.push(fn)

        return this
    }

    /**
     * - Tags a listener function that's called when this [Feature] is unregistered
     * @param {Function} fn
     * @returns {this} meth chain
     */
    onUnregister(fn) {
        this.unregisterListeners.push(fn)

        return this
    }

    /**
     * - Calls every subEvent's condition and (un)register based on its state
     * @returns {this} meth chain
     */
    update() {
        this.subEvents.forEach(([subEvent, condition]) => condition() ? subEvent.register() : subEvent.unregister())

        return this
    }

    /**
     * - Externally registers all subEvents
     * @returns {this} meth chain
     */
    register() {
        this.update()
        for (let listener of this.registerListeners) listener?.()

        return this
    }

    /**
     * - Externally unRegisters all subEvents
     * @returns {this} meth chain
     */
    unregister() {
        for (let subEvent of this.subEvents) subEvent[0].unregister()
        for (let listener of this.unregisterListeners) listener?.()

        return this
    }

    /**
     * - Updates the Feature based on the setting, world, and zone criteria
     * @note Location#inWorld and Location#inZone return true if param is nullish
     * @returns {this} meth chain
     */
    _updateRegister() {
        if (this.setting && !this.settingValue) return this._unregister()
        if (!(Location.inWorld(this.worlds) && Location.inZone(this.zones))) return this._unregister()
        
        return this._register()
    }

    /**
     * - UnRegisters all strung [Events] including subEvents
     * @returns {this} meth chain
     */
    _unregister() {
        if (!this.isRegistered) return this
        
        for (let event of this.events) event.unregister()
        for (let subEvent of this.subEvents) subEvent[0].unregister()
        for (let listener of this.registerListeners) listener?.()
    
        this.isRegistered = false
        return this
    }

    /**
     * - UnRegisters all strung [Events] including subEvents
     * @returns {this} meth chain
     */
    _register() {
        if (this.isRegistered) return this
        
        for (let event of this.events) event.register()
        this.update()
        for (let listener of this.unregisterListeners) listener?.()
    
        this.isRegistered = true
        return this
    }
}