/** 
 * Virtually entire class taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/shared/Location.js
 */

import { Event } from "../core/Event"
import EventEnums from "../core/EventEnums"
import TextUtil from "../core/static/TextUtil"

export default new class Location {
  /**
   * @param {(world: String?) => void} fn 
  */
  registerWorldChange(fn) {
    this._listeners.world.push(fn)

    return this
  }
  
  /**
   * @param {(zone: String?) => void} fn 
  */
  registerZoneChange(fn) {
    this._listeners.zone.push(fn)

    return this
  }

  /**
   * @param {String[]|String|null} world 
   * @returns {Boolean}
   */
  inWorld(world) {
    if (world instanceof Array) return world.includes(this.world)
    if (world instanceof String) return world === this.world
    return true
  }

  /**
   * @param {String[]|String|null} zone 
   * @returns {Boolean}
   */
  inZone(zone) {
    if (zone instanceof Array) return zone.includes(this.zone)
    if (zone instanceof String) return zone === this.zone
    return true
  }

  constructor() {
    new Event(EventEnums.SERVER.TABADD, (world) => this._triggerWorldEvents(world), /^(?:Area|Dungeon): (.+)$/).register()
    new Event(EventEnums.SERVER.SCOREBOARD, (zone) => this._triggerZoneEvents(zone), /^ [⏣ф] (.+)$/).register()
    new Event("worldUnload", () => this._triggerWorldEvents(null)._triggerZoneEvents(null)).register()

    // Ct reload case
    if (World.isLoaded()) {
      TabList.getNames().find(it => {
        [it] = TextUtil.getMatches(/^(?:Area|Dungeon): (.+)$/, it.removeFormatting())
        return it ? Boolean(this._triggerWorldEvents(it)) : false
      })
      Scoreboard.getLines().find(it => {
        [it] = TextUtil.getMatches(/^ [⏣ф] (.+)$/, it.getName().removeFormatting().replace(/[^\x0-\xFF]/g, ""))
        return it ? Boolean(this._triggerZoneEvents(it)) : false
      })
    }
  }

  _listeners = {
    world: [],
    zone: []
  }

  /** @param {String?} world */
  _triggerWorldEvents(world) {
    this.world = world
    this._listeners.world.forEach(fn => fn(world))

    return this
  }

  /** @param {String?} zone */
  _triggerZoneEvents(zone) {
    this.zone = zone
    this._listeners.zone.forEach(fn => fn(zone))

    return this
  }
}