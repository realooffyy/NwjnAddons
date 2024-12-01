import Feature from "../../core/Feature"

new Feature({
    settings: "announceVanqs",
    worlds: "Crimson Isle"
})
    .addEvent("serverChat", () => {
        ChatLib.say(`/pc x: ${ ~~Player.getX() }, y: ${~~Player.getY()}, z: ${~~Player.getZ()} [NwjnAddons] Vanquisher!`)
    }, "A Vanquisher is spawning nearby!")