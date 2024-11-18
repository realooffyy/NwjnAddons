/** 
 * Virtually entirely taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/EventEnums.js
 */

let idx = 0

export default {
  INTERVAL: {
    FPS: idx++,
    SECONDS: idx++,
    TICK: idx++ // Server ticks
  },
  ENTITY: {
    JOINWORLD: idx++,
    SPAWNMOB: idx++,
    DEATH: idx++
  },
  CLIENT: {
    CHAT: idx++,
    COMMAND: idx++,
    SOUNDPLAY: idx++,
    HELDITEMCHANGE: idx++,
    UPDATEINVENTORY: idx++
  },
  SERVER: {
    CHAT: idx++,
    ACTIONBAR: idx++,
    SCOREBOARD: idx++,
    TABUPDATE: idx++,
    TABADD: idx++
  },
  WINDOW: {
    OPEN: idx++,
    CLOSE: idx++,
    CLICK: idx++
  }
}