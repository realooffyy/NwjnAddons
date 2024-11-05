/** 
 * Virtually entire class taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/Feature.js
 */

import Settings from "../data/Settings";
import Location from "../utils/Location"

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
    /** @type import("./Event").Event[] */
    this.events = []
    /** @type Array.<[import("./Event").Event, () => Boolean]> */
    this.subEvents = []

    this.activeFeature = false

    // Listeners
    this._onRegister = []
    this._onUnregister = []

    // If setting exists get its value and register a listener
    this._setSetting(setting)

    // If worlds are required register their listeners
    this._setWorlds(worlds)

    // If zones are required register their listeners
    this._setZones(zones)

    // Init
    register("worldLoad", () => this._updateRegister())
    register("worldUnload", () => this._unregister())
  }

  _setSetting(setting) {
    if (!setting || !(setting in Settings())) return
    this.setting = setting
    this.settingValue = Settings()[setting]

    Settings().getConfig().registerListener(setting, (_, val) => {
      this.settingValue = val
      this._updateRegister()
    })
  }

  _setWorlds(worlds) {
    if (!worlds) return
    worlds = Array.isArray(worlds) ? worlds : Array(worlds)
    this.worlds = worlds

    Location.registerWorldChange(() => this._updateRegister())

    return this
  }

  _setZones(zones) {
    if (!zones) return
    zones = Array.isArray(zones) ? zones : Array(zones)
    this.zones = zones

    Location.registerZoneChange(() => this._updateRegister())

    return this
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
    if (!this.activeFeature) return this
    
    for (let event of this.events) event.unregister()
    for (let subEvent of this.subEvents) subEvent[0].unregister()
    for (let listener of this._onUnregister) listener?.()
  
    this.activeFeature = false
    return this
  }

  /**
   * - Internal use.
   * - Registers all of the events and triggers the listener for this Feature
   * - Only registers the events if it should and if they haven't been registered before-hand
   * @returns {this} meth chain
   */
  _register() {
    if (this.activeFeature) return this
    
    for (let event of this.events) event.register()
    for (let listener of this._onRegister) listener?.()
  
    this.activeFeature = true
    return this
  }

  /**
   * - Adds a [Event] to this Feature
   * @param {import("./Event").Event} event
   * @returns {this} meth chain
   */
  addEvent(event) {
    this.events.push(event)

    return this
  }

  /**
   * - Adds a [SubEvent] to this Feature
   * @param {import("./Event").Event} subEvent
   * @param {() => Boolean} condition The function that will be ran whenever this subEvent gets updated
   * @returns {this} meth chain
   */
  addSubEvent(subEvent, condition) {
    this.subEvents.push([subEvent, condition])

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
}