// import Settings from "../Settings.js";
// import { registerWhen, clamp } from "../utils/functions.js";
// import Loc from "../utils/Location.js"

// /*
// todo: add input for messages to send and create;

// Input:
// • criteria
// • spawn name
// • chat to say in
// import {chatType} from "./utils/Enums.js"

// Settings().forEach()
// register("chat", () => {
//   ChatLib.say(`/${chatType[Settings().chatType]} x: ${ ~~Player.getX() }, y: ${~~Player.getY()}, z: ${~~Player.getZ()} [NwjnAddons] Vanquisher!`)
// }).setCriteria(Settings().criteria)
// */
// registerWhen(register("chat", () => {
//   ChatLib.say(`/pc x: ${ ~~Player.getX() }, y: ${~~Player.getY()}, z: ${~~Player.getZ()} [NwjnAddons] Vanquisher!`)
// }).setCriteria("A Vanquisher is spawning nearby!"), () => Settings().announceVanqs && Loc.inWorld("Crimson Isle"));