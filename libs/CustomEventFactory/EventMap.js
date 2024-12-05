/** 
 * Virtually entire file taken from:
 * @author DocilElm
 * @license {GNU-GPL-3} https://github.com/DocilElm/Doc/blob/main/LICENSE
 * @credit https://github.com/DocilElm/Doc/blob/main/core/EventEnums.js
 */

import TextUtil from "../../core/static/TextUtil"
import ItemUtil from "../../core/static/ItemUtil"
import { scheduleTask } from "../../utils/Ticker"

const S38PacketPlayerListItem = net.minecraft.network.play.server.S38PacketPlayerListItem

/** @type {HashMap<String,Function>} */
const map = new HashMap()

const createEvent = (triggerType, method) => {
    map.put(triggerType.toUpperCase(), method)
}

createEvent("interval", (fn, interval) => {
    const reg = register("step", fn)

    if (interval >= 1) return reg.setDelay(interval)
    return reg.setFps(1 / interval)
})

createEvent("serverTick", (fn) => 
    register("packetReceived", (packet) => {
        if (packet.func_148890_d() <= 0) fn()
    }).setFilteredClass(net.minecraft.network.play.server.S32PacketConfirmTransaction)
)

createEvent("spawnDamageTag", (fn) =>
    register("packetReceived", (packet, event) => {
        if (packet.func_149025_e() !== 30) return

        const firstString = packet.func_149027_c().find(o => o.func_75674_c() === 4)?.func_75669_b()
        if (firstString && !firstString.includes(" ")) fn(firstString)
    }).setFilteredClass(net.minecraft.network.play.server.S0FPacketSpawnMob)
)

createEvent("spawnObject", (fn) =>
    register("packetReceived", (packet, event) => 
        fn(packet.func_148993_l(), event)
    ).setFilteredClass(net.minecraft.network.play.server.S0EPacketSpawnObject)
)

createEvent("spawnPainting", (fn) => 
    register("packetReceived", (_, event) => 
        fn(event)
    ).setFilteredClass(net.minecraft.network.play.server.S10PacketSpawnPainting)
)

createEvent("spawnExp", (fn) => 
    register("packetReceived", (_, event) => 
        fn(event)
    ).setFilteredClass(net.minecraft.network.play.server.S11PacketSpawnExperienceOrb)
)

createEvent("armorStandDeath", (fn) => 
    register("packetReceived", (packet) => {
        const dataWatcherList = packet.func_149376_c()
        if (dataWatcherList?.length !== 1) return

        const entry = dataWatcherList[0]
        if (entry.func_75674_c() !== 4) return
        if (!/§r §[^a]0(§f\/|§c❤)/.test(entry.func_75669_b())) return

        const entity = World.getWorld().func_73045_a(packet.func_149375_d())
        if (!entity) return

        fn(entity)
    }).setFilteredClass(net.minecraft.network.play.server.S1CPacketEntityMetadata)
)

createEvent("serverChat", (fn, criteria = "") => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
    
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted, chatComponent)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)
)

createEvent("messageSent", (fn, criteria) => 
    register("messageSent", (msg, event) => {
        TextUtil.matchesCriteria(fn, criteria, msg, event, msg)
    })
)

createEvent("actionBarChange", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        // Check if the packet is for the actionbar
        if (!packet.func_148916_d()) return

        const chatComponent = packet.func_148915_c()        
        const formatted = chatComponent?.func_150254_d()
        const unformatted = formatted?.removeFormatting()
        
        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
    }).setFilteredClass(net.minecraft.network.play.server.S02PacketChat)
)

createEvent("sideBarChange", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const channel = packet.func_149307_h()

        if (channel !== 2) return

        const teamStr = packet.func_149312_c()
        const teamMatch = teamStr.match(/^team_(\d+)$/)

        if (!teamMatch) return

        const formatted = packet.func_149311_e().concat(packet.func_149309_f())
        const unformatted = formatted.removeFormatting()

        if (!unformatted) return
        
        TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
    }).setFilteredClass(net.minecraft.network.play.server.S3EPacketTeams)
)

createEvent("tabAdd", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const players = packet.func_179767_a() // .getPlayers()
        const action = packet.func_179768_b() // .getAction()

        if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return

        players.forEach(addPlayerData => {
            const name = addPlayerData.func_179961_d() // .getDisplayName()
            
            if (!name) return
            const formatted = name.func_150254_d() // .getFormattedText()
            const unformatted = formatted.removeFormatting()
        
            if (action !== S38PacketPlayerListItem.Action.ADD_PLAYER) return

            TextUtil.matchesCriteria(fn, criteria, unformatted, event, formatted)
        })
    }).setFilteredClass(S38PacketPlayerListItem)
)

createEvent("worldSound", (fn, criteria) => 
    register("packetReceived", (packet, event) => {
        const name = packet.func_149212_c()

        TextUtil.matchesCriteria(fn, criteria, name, event)
    }).setFilteredClass(net.minecraft.network.play.server.S29PacketSoundEffect)
)

createEvent("containerClick", (fn) => 
    register("packetSent", (packet) => {
        // Container name, Slot clicked
        fn(Player.getContainer().getName(), packet.func_149544_d())
    }).setFilteredClass(net.minecraft.network.play.client.C0EPacketClickWindow)
)

export const getEvent = (triggerType, method, args) => {
    const type = typeof(triggerType) === "string" ? triggerType.toUpperCase() : triggerType

    const trigger =
        map.containsKey(type) ?
        map.get(type)(method, args) :
        register(type, method)
    
    return trigger.unregister()
}