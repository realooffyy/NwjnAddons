import Feature from "../../core/Feature";
import Event from "../../libs/CustomEventFactory/Event"

const absoluteError = 0.1;
const ratioForFallingBlocks = 31.75;

/** 
 * @param {Number} packetYLevel
 * @returns {Boolean} 
 */
const weirdCheckIfIsFallingBlock = (packetYLevel) => {
  const ratio = packetYLevel / Player.getY()

  const diff = Math.abs(ratio - ratioForFallingBlocks)

  const withinError = diff < absoluteError

  return withinError
}

new Feature({setting: "fallingBlocks"})
  .addEvent(
    new Event("spawnObject", (packet, event) => {
      if (weirdCheckIfIsFallingBlock(packet.func_148998_e())) cancel(event)
    })
  )