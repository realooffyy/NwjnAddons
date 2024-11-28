import Feature from "../../core/Feature"
import Event from "../../libs/CustomEventFactory/Event";

new Feature({
    settings: "announceVanqs",
    worlds: "Crimson Isle"
})
    .addEvent(
        new Event("serverChat", () => {
            ChatLib.say(`/pc x: ${ ~~Player.getX() }, y: ${~~Player.getY()}, z: ${~~Player.getZ()} [NwjnAddons] Vanquisher!`)
        }, "A Vanquisher is spawning nearby!")
    )